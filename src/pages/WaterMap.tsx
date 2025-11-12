import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ReactDOM from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { circle } from '@turf/turf';
import { ChevronDown, ChevronUp, Circle } from 'lucide-react';

interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // Coordinates in [longitude, latitude] format
  };
  properties: {
    type: string;
    // properties of Fountain
    dog_bowl?: boolean;
    bottle_refill_tap?: boolean;
    // properties for toilet
    name?: string;
    sub_type?: string;
    address?: string;
    town?: string;
    accessible?: boolean;
    parking?: boolean;
    parking_accessible?: boolean;
    adult_change?: boolean;
    changing_places?: boolean;
    baby_change?: boolean;
    baby_care_room?: boolean;
    dump_point?: boolean;
    dp_washout?: boolean;
    dp_after_hours?: boolean;
    dump_point_note?: string;
    opening_hours?: string;
    opening_hours_note?: string;
    male?: boolean;
    female?: boolean;
    unisex?: boolean;
    all_gender?: boolean;
    ambulant?: boolean;
    toilet_note?: string;
    shower?: boolean;
  };
}

interface GeoJSONData {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

declare global {
  interface Window {
    google: unknown;
  }
}

function Legend() {
  return (
    <div className="bg-white p-2 rounded shadow-md">
      <h3 className="font-bold mb-2">Click points to get details</h3>
      
      <div className="flex items-center mb-1">
        <span className="text-lg mr-2">💧</span>
        <span>Drinking Fountain</span>
      </div>
      
      <div className="flex items-center mb-1">
        <span className="text-lg mr-2">🗑️</span>
        <span>Dump Point</span>
      </div>
      
      <div className="flex items-center mb-1">
        <span className="text-lg mr-2">🚿</span>
        <span>Shower</span>
      </div>
      
      <div className="flex items-center mb-1">
        <span className="text-lg mr-2">🚽</span>
        <span>Toilet</span>
      </div>
      
      <div className="flex items-center mb-1">
        <span className="text-lg mr-2">🏞️</span>
        <span>Attraction</span>
      </div>
    </div>
  );
}

export default function WaterMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const directionsRef = useRef<InstanceType<typeof MapboxDirections> | null>(null);
  
  const [data, setData] = useState<GeoJSONData | null>(null);
  const [filterDogBowl, setFilterDogBowl] = useState(false);
  const [filterBottleTap, setFilterBottleTap] = useState(false);
  const [isNoDataDialogOpen, setIsNoDataDialogOpen] = useState(false);

  const [origin, setOrigin] = useState('Current Location');
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [startMarker, setStartMarker] = useState<mapboxgl.Marker | null>(null);
  const [radiusLayer, setRadiusLayer] = useState<string | null>(null);

  const [filterDP, setFilterDP] = useState(false);
  const [filterParking, setFilterParking] = useState(false);
  const [filterAccessible, setFilterAccessible] = useState(false);
  const [filterMale, setFilterMale] = useState(false);
  const [filterFemale, setFilterFemale] = useState(false);
  const [filterShower, setFilterShower] = useState(false);
  const [filterAC, setFilterAC] = useState(false);
  const [filterBC, setFilterBC] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [selectedType, setSelectedType] = useState<'fountain' | 'toilet' | null>(null);

  // Reset filters when changing type
  const resetFilters = useCallback(() => {
    setFilterDogBowl(false);
    setFilterBottleTap(false);
    setFilterDP(false);
    setFilterShower(false);
    setFilterParking(false);
    setFilterAccessible(false);
    setFilterMale(false);
    setFilterFemale(false);
    setFilterAC(false);
    setFilterBC(false);
  }, []);

  const handleTypeChange = useCallback((type: 'fountain' | 'toilet' | null) => {
    if (type === selectedType) {
      setSelectedType(null);
    } else {
      setSelectedType(type);
      resetFilters();
    }
  }, [selectedType, resetFilters]);

  function createPopupContent(feature: GeoJSONFeature, coordinates: [number, number]): string {
    const { properties } = feature;
    let descriptionHtml = `<h3 style="font-weight: bold;">${properties.name || 'Drinking Fountain'}</h3>`;
    
    if (properties.type === 'Fountain') {
      descriptionHtml += `
        <p>Dog Bowl: ${properties.dog_bowl ? 'Yes' : 'No'}</p>
        <p>Bottle Refill Tap: ${properties.bottle_refill_tap ? 'Yes' : 'No'}</p>
      `;
    } else {
      descriptionHtml += `
        <p>Address: ${properties.address}, ${properties.town}</p>
        <p>${properties.opening_hours}</p>
        <p>Shower: ${properties.shower ? 'Yes' : 'No'}</p>
        <p>Dump Point: ${properties.dump_point ? 'Yes' : 'No'}</p>
      `;
    }
    
    descriptionHtml += `
      <button onclick="getDirections(${coordinates[1]}, ${coordinates[0]})" style="background-color: #3b82f6; color: white; padding: 8px 16px; border: none; border-radius: 4px; margin-top: 10px; cursor: pointer;">Get Directions</button>
    `;
    
    return descriptionHtml;
  }

  const updateStartPoint = useCallback((lng: number, lat: number) => {
    if (mapRef.current) {
      // Remove marker radius layer
      if (startMarker) startMarker.remove();
      if (radiusLayer && mapRef.current.getLayer(radiusLayer)) {
        mapRef.current.removeLayer(radiusLayer);
        mapRef.current.removeSource(radiusLayer);
      }
  
      // new marker
      const newMarker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
      setStartMarker(newMarker);
  
      // radius
      const center: [number, number] = [lng, lat];
      const radius = 5;
      const options = { steps: 64, units: 'kilometers' as const };
      const circleData = circle(center, radius, options);
  
      const circleLayerId = 'radius-layer';
      if (mapRef.current.getSource(circleLayerId)) {
        (mapRef.current.getSource(circleLayerId) as mapboxgl.GeoJSONSource).setData(circleData);
      } else {
        mapRef.current.addSource(circleLayerId, {
          type: 'geojson',
          data: circleData
        });
        mapRef.current.addLayer({
          id: circleLayerId,
          type: 'fill',
          source: circleLayerId,
          paint: {
            'fill-color': '#3bb2d0',
            'fill-opacity': 0.2
          }
        });
      }
      setRadiusLayer(circleLayerId);
  
      // center
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 11
      });
    }
  }, [mapRef, startMarker, radiusLayer, setStartMarker, setRadiusLayer]);
  

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

      // Initialize the Mapbox GL JS map
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [144.9631, -37.8136],
        zoom: 6,
      });

      // Define and set the map bounds
      const bounds = new mapboxgl.LngLatBounds(
        [140.9618, -39.1583], // Southwest coordinates of Victoria
        [150.0233, -33.9806]  // Northeast coordinates
      );
      mapRef.current.setMaxBounds(bounds);  // This restricts the map movement to within the bounds

      // Initialize the MapboxDirections control with fixed start point
      // directionsRef.current = new MapboxDirections({
      //   accessToken: mapboxgl.accessToken,
      //   unit: 'metric',
      //   profile: 'mapbox/driving',
      //   interactive: false,
      //   controls: {
      //     inputs: false, // Hide search box
      //     instructions: false,
          
      //   },
      //   originMarker: false,
      //   country: 'au',
      // });
      // mapRef.current.addControl(directionsRef.current, 'top-left');

      // Set fixed start point
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { longitude, latitude } = position.coords;
          directionsRef.current?.setOrigin([longitude, latitude]);
        });
      }

      // Initialize Google Maps Autocomplete
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        const destInput = document.getElementById('destination-input') as HTMLInputElement;
        const originInput = document.getElementById('origin-input') as HTMLInputElement;
        autocompleteRef.current = new window.google.maps.places.Autocomplete(destInput, {
          bounds: new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(-37.8600, 144.8924),
            new window.google.maps.LatLng(-37.7712, 145.0005)
          ),
          componentRestrictions: { country: 'au' },
        });
        originAutocompleteRef.current = new window.google.maps.places.Autocomplete(originInput, {
          bounds: new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(-37.8600, 144.8924),
            new window.google.maps.LatLng(-37.7712, 145.0005)
          ),
          componentRestrictions: { country: 'au' },
        });
      };
      document.head.appendChild(script);

      // Add navigation controls (zoom in/out)
      const nav = new mapboxgl.NavigationControl();
      mapRef.current.addControl(nav, 'top-right');

      mapRef.current.on('load', () => {
        fetch('https://zrvasoqmt4.execute-api.us-east-1.amazonaws.com/prod/query', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'TQj3QrDIGj7Oi36MkJHga6NRwwgVa9Vc9ar4oJpV'
          },
        })
          .then(response => response.json())
          .then((data) => {
            const parsedGeojson: GeoJSONData = JSON.parse(data.body);

            console.log('GeoJSON Data:', parsedGeojson); // Check data structure
            setData(parsedGeojson);
          });
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).getDirections = (lat: number, lng: number) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            updateStartPoint(longitude, latitude);
            const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${lat},${lng}&travelmode=driving`;
            window.open(url, '_blank');
          }, () => {
            alert('Unable to get your current location. Please check your browser settings.');
          });
        } else {
          alert('Geolocation is not supported by your browser.');
        }
      };

      mapRef.current!.on('click', 'clusters', (e) => {
        const features = mapRef.current?.queryRenderedFeatures(e.point, { layers: ['clusters'] }) ?? [];
        const clusterId = features[0]?.properties?.cluster_id;
        const pointCount = features[0]?.properties?.point_count;
        
        // Debug: log cluster information
        if (pointCount) {
          console.log(`Cluster clicked: ID=${clusterId}, Point count=${pointCount}`);
        }
        
        (mapRef.current?.getSource('places') as mapboxgl.GeoJSONSource)?.getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) {
              console.error('Error getting cluster expansion zoom:', err);
              return;
            }

            mapRef.current!.easeTo({
              center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
              zoom: zoom as number,
            });
          }
        );
      });

      mapRef.current.on('click', 'unclustered-point', (e) => {
        console.log('Point clicked');
        const feature = e.features && e.features[0];
        if (feature && feature.geometry.type === 'Point') {
          const coordinates = feature.geometry.coordinates.slice() as [number, number];

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(createPopupContent(feature as unknown as GeoJSONFeature, coordinates))
            .addTo(mapRef.current!);
        }
      });

      const legendControl = new mapboxgl.NavigationControl();
      legendControl.onAdd = function() {
        const div = document.createElement('div');
        ReactDOM.render(<Legend />, div);
        return div;
      };
      mapRef.current.addControl(legendControl, 'top-left');
    }
  }, [updateStartPoint]);

  useEffect(() => {
    const addFountainsLayer = async (map: mapboxgl.Map, data: GeoJSONData) => {
      const filteredData = {
        ...data,
        features: data.features.filter(feature => {
          const featureType = feature.properties.type;
          
          // First, filter by selected type
          if (selectedType !== null) {
            if (selectedType === 'fountain' && featureType !== 'Fountain') {
              return false;
            }
            if (selectedType === 'toilet' && (featureType === 'Fountain' || featureType === 'Attraction')) {
              return false;
            }
          }
          
          // Then apply type-specific filters
          if (featureType === 'Fountain') {
            // For fountains, apply fountain-specific filters
            const passesDogBowlFilter = !filterDogBowl || feature.properties.dog_bowl === true;
            const passesBottleTapFilter = !filterBottleTap || feature.properties.bottle_refill_tap === true;
            return passesDogBowlFilter && passesBottleTapFilter;
          } else if (featureType === 'Attraction') {
            // Attractions are always shown (no filters applied)
            return true;
          } else {
            // For toilets and other types, apply toilet-specific filters
            const passesDPFilter = !filterDP || feature.properties.dump_point === true;
            const passesShowerFilter = !filterShower || feature.properties.shower === true;
            const passesParkingFilter = !filterParking || feature.properties.parking === true;
            const passesAccessibleFilter = !filterAccessible || feature.properties.accessible === true;
            const passesMaleFilter = !filterMale || feature.properties.male === true;
            const passesFemaleFilter = !filterFemale || feature.properties.female === true;
            const passesACFilter = !filterAC || feature.properties.adult_change === true;
            const passesBCFilter = !filterBC || feature.properties.baby_care_room === true;
            
            return passesDPFilter && passesShowerFilter && passesParkingFilter && 
                   passesAccessibleFilter && passesMaleFilter && passesFemaleFilter && 
                   passesACFilter && passesBCFilter;
          }
        })
      };

      // No need to load icons - we'll use emoji text instead

      // Log filtered data for debugging
      const typeCounts = filteredData.features.reduce((acc, f) => {
        const type = f.properties.type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log(`Filtered data: ${filteredData.features.length} features out of ${data.features.length} total`);
      console.log('Type distribution:', typeCounts);

      if (filteredData.features.length === 0) {
        setIsNoDataDialogOpen(true);
      } else {
        setIsNoDataDialogOpen(false);
      }

      // Convert emoji to image and load into Mapbox
      const emojiToImage = (emoji: string, name: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          // Check if image already exists
          if (map.hasImage(name)) {
            resolve();
            return;
          }

          const canvas = document.createElement('canvas');
          const size = 40; // Icon size
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Set font size for emoji
          ctx.font = `${size * 0.8}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Draw emoji on canvas
          ctx.fillText(emoji, size / 2, size / 2);
          
          // Convert canvas to image
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }
            
            const img = new Image();
            img.onload = () => {
              try {
                map.addImage(name, img);
                resolve();
              } catch (error) {
                console.warn(`Failed to add icon ${name}:`, error);
                resolve(); // Continue even if one icon fails
              }
            };
            img.onerror = () => {
              console.error(`Failed to load icon ${name}`);
              reject(new Error(`Failed to load icon ${name}`));
            };
            img.src = URL.createObjectURL(blob);
          }, 'image/png');
        });
      };

      // Load all emoji icons
      const loadEmojiIcons = async () => {
        try {
          await Promise.all([
            emojiToImage('💧', 'fountain-icon'),
            emojiToImage('🚿', 'shower-icon'),
            emojiToImage('🗑️', 'dump-point-icon'),
            emojiToImage('🏞️', 'attraction-icon'), // Changed to mountain/lake emoji
            emojiToImage('🚽', 'toilet-icon'),
          ]);
          console.log('All emoji icons loaded successfully');
        } catch (error) {
          console.error('Error loading emoji icons:', error);
        }
      };

      // Load icons before adding layers
      loadEmojiIcons().then(() => {
        // Update or add source after icons are loaded
      if (map.getSource('places')) {
        // Source exists, just update the data
        // This will trigger Mapbox to recalculate clusters automatically
        (map.getSource('places') as mapboxgl.GeoJSONSource).setData(filteredData);
        
        // Ensure unclustered-point layer exists and uses emoji icons
        if (!map.getLayer('unclustered-point')) {
          map.addLayer({
            id: 'unclustered-point',
            type: 'symbol',
            source: 'places',
            filter: ['!', ['has', 'point_count']],
            layout: {
              'icon-image': [
                'case',
                ['==', ['get', 'type'], 'Fountain'], 'fountain-icon',
                ['==', ['get', 'type'], 'Attraction'], 'attraction-icon',
                ['==', ['get', 'sub_type'], 'Shower'], 'shower-icon',
                ['==', ['get', 'sub_type'], 'Dump Point'], 'dump-point-icon',
                'toilet-icon' // Default for toilets and other cases
              ],
              'icon-size': 0.5, // Smaller size to match Travel.tsx
              'icon-allow-overlap': false,
            },
          });
        }
      } else {
        // Source doesn't exist, create it and add layers
        map.addSource('places', {
          type: 'geojson',
          data: filteredData,
          cluster: true,
          clusterMaxZoom: 10, // Max zoom to cluster points
          clusterRadius: 50,  // Radius of each cluster when clustering points
        });
  
        // Add cluster layer
        if (!map.getLayer('clusters')) {
          map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'places',
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': [
                'step',
                ['get', 'point_count'],
                '#f1f075',
                10,
                '#ed9e28',
                50,
                '#f28cb1',
              ],
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                10,
                30,
                50,
                40,
              ],
            },
          });
        }
  
        // Add cluster count layer
        if (!map.getLayer('cluster-count')) {
          map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'places',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': '{point_count_abbreviated}',
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12,
            },
          });
        }
  
        // Add unclustered points layer using emoji icons
        if (!map.getLayer('unclustered-point')) {
          map.addLayer({
            id: 'unclustered-point',
            type: 'symbol',
            source: 'places',
            filter: ['!', ['has', 'point_count']],
            layout: {
              'icon-image': [
                'case',
                ['==', ['get', 'type'], 'Fountain'], 'fountain-icon',
                ['==', ['get', 'type'], 'Attraction'], 'attraction-icon',
                ['==', ['get', 'sub_type'], 'Shower'], 'shower-icon',
                ['==', ['get', 'sub_type'], 'Dump Point'], 'dump-point-icon',
                'toilet-icon' // Default for toilets and other cases
              ],
              'icon-size': 0.8, // Smaller size to match Travel.tsx
              'icon-allow-overlap': false,
            },
          });
        }
      }
      });
    };
    
    if (mapRef.current && data) {
      addFountainsLayer(mapRef.current, data).catch(error => {
        console.error('Error in addFountainsLayer:', error);
      });
    }
  }, [data, filterDogBowl, filterBottleTap, filterDP, filterShower, filterParking, filterAccessible, filterMale, filterFemale, filterAC, filterBC, selectedType]);

  

  
  const handleSearch = () => {
    if (autocompleteRef.current && originAutocompleteRef.current) {
      const originPlace = originAutocompleteRef.current.getPlace();
      if (originPlace && originPlace.geometry && originPlace.geometry.location) {
        const lat = originPlace.geometry.location.lat();
        const lng = originPlace.geometry.location.lng();
        directionsRef.current?.setOrigin([lng, lat]);
        updateStartPoint(lng, lat); // 确保更新起点
      } else if (origin === 'Current Location') {
        navigator.geolocation.getCurrentPosition((position) => {
          const { longitude, latitude } = position.coords;
          directionsRef.current?.setOrigin([longitude, latitude]);
          updateStartPoint(longitude, latitude);
        });
      } else {
        console.error("Origin place or geometry is undefined");
        alert("Please enter a valid origin.");
        return;
      }
    }
  };

  const handleReset = () => {
    setOrigin('Current Location');
    navigator.geolocation.getCurrentPosition((position) => {
      const { longitude, latitude } = position.coords;
      updateStartPoint(longitude, latitude);
    });
  };
  
  return (
    <div className="flex flex-col md:flex-row h-screen ">
      {/* Steps - Hidden on mobile, visible on md screens and up */}
      <div className="hidden md:flex w-full md:w-1/4 p-4 md:p-8 flex-col justify-center items-center">
        <div className="space-y-4 md:space-y-8 relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          {[
            "Search your location",
            "Choose amenities type and filters",
            "Click a point to get directions"
          ].map((step, index) => (
            <div key={index} className="flex items-center relative">
              <Circle className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 text-white rounded-full z-10 flex items-center justify-center">
                {index + 1}
              </Circle>
              <span className="ml-2 md:ml-4 text-sm md:text-base font-bold">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="w-full md:w-3/4 flex flex-col h-full overflow-hidden bg-gray-100 rounded-lg p-8">
        {/* Search Bar */}
        <div className="p-2 md:p-4 flex flex-col items-center w-full">
          <h1 className='text-xl md:text-2xl lg:text-4xl text-center mb-2 md:mb-4'>Search nearby water amenities</h1>
          <div className="flex flex-col md:flex-row w-full max-w-xl mb-2 space-y-2 md:space-y-0 md:space-x-2">
            <Input
              id="origin-input"
              type="text"
              placeholder="Enter starting point"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="p-2 border rounded flex-grow"
            />
            <div className="flex space-x-2">
              <Button onClick={handleReset} className="p-2 bg-gray-300 text-gray-700 rounded flex-grow md:flex-grow-0">
                Reset 
              </Button>
              <Button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded flex-grow md:flex-grow-0">
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="w-full max-w-xl mx-auto mb-4 px-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              variant="ghost"
              size="sm"
            >
              {isFilterExpanded ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
          
          {isFilterExpanded && (
            <>
              <div className="flex justify-center space-x-4 mb-4">
                <Button
                  onClick={() => handleTypeChange('fountain')}
                  variant={selectedType === 'fountain' ? 'default' : 'outline'}
                  className="text-sm md:text-base"
                >
                  Fountain(City of Melbourne)
                </Button>
                <Button
                  onClick={() => handleTypeChange('toilet')}
                  variant={selectedType === 'toilet' ? 'default' : 'outline'}
                  className="text-sm md:text-base"
                >
                  Toilet
                </Button>
              </div>

          {selectedType === 'fountain' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="dog-bowl">With Dog Bowl</Label>
                <Switch id="dog-bowl" checked={filterDogBowl} onCheckedChange={setFilterDogBowl}/>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="bottle-tap">With Bottle Refill Tap</Label>
                <Switch id="bottle-tap" checked={filterBottleTap} onCheckedChange={setFilterBottleTap}/>
              </div>
            </div>
          )}
        

          {selectedType === 'toilet' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="dump-point">Dump Point</Label>
                <Switch id="dump-point" checked={filterDP} onCheckedChange={setFilterDP}/>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="shower">Shower</Label>
                <Switch id="shower" checked={filterShower} onCheckedChange={setFilterShower}/>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="parking">Parking</Label>
                <Switch id="parking" checked={filterParking} onCheckedChange={setFilterParking}/>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="accessible">Accessible</Label>
                <Switch id="accessible" checked={filterAccessible} onCheckedChange={setFilterAccessible}/>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="male">Male</Label>
                <Switch id="male" checked={filterMale} onCheckedChange={setFilterMale}/>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="female">Female</Label>
                <Switch id="female" checked={filterFemale} onCheckedChange={setFilterFemale}/>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="adult-change">Adult Change Room</Label>
                <Switch id="adult-change" checked={filterAC} onCheckedChange={setFilterAC}/>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="baby-care">Baby Care Room</Label>
                <Switch id="baby-care" checked={filterBC} onCheckedChange={setFilterBC}/>
              </div>
            </div>
          )}
          </>
          )}
        </div>

        {/* Map */}
        <div className="flex-grow relative bg-gray-100 rounded-lg shadow-md m-2 md:m-4 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div ref={mapContainerRef} className="absolute inset-0 bg-gray-100"></div>
        </div>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={isNoDataDialogOpen} onOpenChange={setIsNoDataDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No Data Available</AlertDialogTitle>
            <AlertDialogDescription>
              The filter you applied returned no results. Please try adjusting your filters.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsNoDataDialogOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}