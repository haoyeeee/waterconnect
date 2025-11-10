import { useEffect, useRef, useState, useCallback } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { createRoot } from 'react-dom/client';
import showerIconPath from '../assets/shower.svg';
import fountainIconPath from '../assets/fountain.svg';
import attractionIconPath from '../assets/attraction.svg';
import dumpPointIconPath from '../assets/dump.svg';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WaypointInfo {
  name: string;
  coordinates: [number, number];
  type: string;
  sub_type?: string;
}

interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // Coordinates in [longitude, latitude] format
  };
  properties: {
    type: string;
    // properties of Attraction
    picture: string;
    introduction: string;
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
        <img src={fountainIconPath} alt="Drinking Fountain" className="w-4 h-4 mr-2" />
        <span>Drinking Fountain</span>
      </div>
      
      <div className="flex items-center mb-1">
        <img src={dumpPointIconPath} alt="Dump Point" className="w-4 h-4 mr-2" />
        <span>Dump Point</span>
      </div>
      
      <div className="flex items-center mb-1">
        <img src={showerIconPath} alt="Shower" className="w-4 h-4 mr-2" />
        <span>Shower</span>
      </div>

      <div className="flex items-center mb-1">
        <img src={attractionIconPath} alt="Attraction" className="w-4 h-4 mr-2" />
        <span>Attraction</span>
      </div>
    </div>
  );
}

export default function Travel() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const directionsRef = useRef<InstanceType<typeof MapboxDirections> | null>(null);
  
  const [data, setData] = useState<GeoJSONData | null>(null);
  const [filterDogBowl, setFilterDogBowl] = useState(false);
  const [filterBottleTap, setFilterBottleTap] = useState(false);
  const [isNoDataDialogOpen, setIsNoDataDialogOpen] = useState(false);

  const [origin, setOrigin] = useState('Current Location');
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [destination, setDestination] = useState('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [filterDP, setFilterDP] = useState(false);
  const [filterParking, setFilterParking] = useState(false);
  const [filterAccessible, setFilterAccessible] = useState(false);
  const [filterMale, setFilterMale] = useState(false);
  const [filterFemale, setFilterFemale] = useState(false);
  const [filterShower, setFilterShower] = useState(false);
  const [filterAC, setFilterAC] = useState(false);
  const [filterBC, setFilterBC] = useState(false);

  // const [isMapInitialized, setIsMapInitialized] = useState(false); // 新增状态以跟踪地图是否已初始化

  const [waypoints, setWaypoints] = useState<[number, number][]>([]);
  const [selectedType, setSelectedType] = useState<'fountain' | 'toilet' | 'attraction' | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  // const [transportMode, setTransportMode] = useState<'driving' | 'walking' | 'cycling'>('driving');

  const [step, setStep] = useState(1);
  const [originError, setOriginError] = useState('');
  const [destinationError, setDestinationError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [directions, setDirections] = useState<any>(null);

  const [waypointInfo, setWaypointInfo] = useState<WaypointInfo[]>([]);

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

  const handleTypeChange = useCallback((type: 'fountain' | 'toilet' | 'attraction' | null) => {
    if (type === selectedType) {
      setSelectedType(null);
    } else {
      setSelectedType(type);
      resetFilters();
    }
  }, [selectedType, resetFilters]);

  // const initializeAutocomplete = useCallback(() => {
  //   if (window.google && window.google.maps && window.google.maps.places) {
  //     const destInput = document.getElementById('destination-input') as HTMLInputElement;
  //     const originInput = document.getElementById('origin-input') as HTMLInputElement;
      
  //     if (destInput && originInput) {
  //       autocompleteRef.current = new window.google.maps.places.Autocomplete(destInput, {
  //         bounds: new window.google.maps.LatLngBounds(
  //           new window.google.maps.LatLng(-37.8600, 144.8924),
  //           new window.google.maps.LatLng(-37.7712, 145.0005)
  //         ),
  //         componentRestrictions: { country: 'au' },
  //       });
  //       originAutocompleteRef.current = new window.google.maps.places.Autocomplete(originInput, {
  //         bounds: new window.google.maps.LatLngBounds(
  //           new window.google.maps.LatLng(-37.8600, 144.8924),
  //           new window.google.maps.LatLng(-37.7712, 145.0005)
  //         ),
  //         componentRestrictions: { country: 'au' },
  //       });
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!window.google) {
  //     const script = document.createElement('script');
  //     script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
  //     script.async = true;
  //     script.defer = true;
  //     script.onload = initializeAutocomplete;
  //     document.head.appendChild(script);
  //   } else {
  //     initializeAutocomplete();
  //   }
  // }, [initializeAutocomplete]);

  const addWaypoint = useCallback((lat: number, lng: number, feature: GeoJSONFeature) => {
    setWaypoints((prev) => {
      const exists = prev.some(wp => wp[0] === lng && wp[1] === lat);
      if (exists) {
        return prev;
      }

      const newWaypoints: [number, number][] = [...prev, [lng, lat]];

      if (directionsRef.current) {
        directionsRef.current.addWaypoint(newWaypoints.length - 1, [lng, lat]);
      }

      // 使用 feature 的属性来设置 waypointInfo
      const newInfo: WaypointInfo = {
        name: feature.properties.name || 'Drinking Fountain',
        coordinates: [lng, lat],
        type: feature.properties.type,
        sub_type: feature.properties.sub_type
      };

      setWaypointInfo(prevInfo => {
        const exists = prevInfo.some(wp => wp.coordinates[0] === lng && wp.coordinates[1] === lat);
        if (exists) {
          return prevInfo;
        }
        return [...prevInfo, newInfo];
      });

      return newWaypoints;
    });
  }, []);
  
  const removeWaypoint = (index: number) => {
    setWaypoints((prev) => {
      const newWaypoints = prev.filter((_, i) => i !== index);
  
      if (directionsRef.current) {
        directionsRef.current.removeWaypoint(index);
      }
  
      setWaypointInfo(prevInfo => prevInfo.filter((_, i) => i !== index));
  
      return newWaypoints;
    });
  };
  
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
      directionsRef.current = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: `mapbox/driving`,
        interactive: false,
        controls: {
          // inputs: false, // Hide search box
          instructions: true,
          profileSwitcher: true
          
        },
        country: 'au',
      });
      mapRef.current.addControl(directionsRef.current, 'top-left');

      // Set fixed start point
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition((position) => {
      //     const { longitude, latitude } = position.coords;
      //     directionsRef.current?.setOrigin([longitude, latitude]);
      //   });
      // }

      // Initialize Google Maps Autocomplete
      const loadGoogleMapsScript = () => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initializeAutocomplete;
        document.head.appendChild(script);
      };
  
      const initializeAutocomplete = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          const destInput = document.getElementById('destination-input') as HTMLInputElement;
          const originInput = document.getElementById('origin-input') as HTMLInputElement;
          
          if (destInput && originInput) {
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
      
            // 监听 place_changed 事件，更新输入框内容
            autocompleteRef.current.addListener('place_changed', () => {
              const place = autocompleteRef.current?.getPlace();
              if (place && place.formatted_address) {
                setDestination(place.formatted_address);  // 更新输入框的值
              }
            });
      
            originAutocompleteRef.current.addListener('place_changed', () => {
              const place = originAutocompleteRef.current?.getPlace();
              if (place && place.formatted_address) {
                setOrigin(place.formatted_address);  // 更新输入框的值
              }
            });
          }
        }
      };
  
      loadGoogleMapsScript();

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
        (mapRef.current?.getSource('places') as mapboxgl.GeoJSONSource)?.getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;

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
            .setDOMContent(createPopupContent(feature as unknown as GeoJSONFeature, coordinates)) // 使用 setDOMContent 方法添加 DOM 节点
            .addTo(mapRef.current!);
        }
      });

      const legendControl = new mapboxgl.NavigationControl();
      legendControl.onAdd = function() {
        const div = document.createElement('div');
        const root = createRoot(div);
        root.render(<Legend />);
        return div;
      };

      mapRef.current.addControl(legendControl, 'top-left');

      const truncateText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
        }
        return text;
      };

      const createPopupContent = (feature: GeoJSONFeature, coordinates: [number, number]): HTMLElement => {
        const { properties } = feature;
        const container = document.createElement('div');
      
        const title = document.createElement('h3');
        title.style.fontWeight = 'bold';
        title.style.fontSize = '14px';
        title.style.paddingBottom = '2px';
        title.innerText = truncateText(properties.name || 'Drinking Fountain', 50);  // 限制标题为50字符
        container.appendChild(title);
      
        if (properties.type === 'Fountain') {
          const dogBowl = document.createElement('p');
          dogBowl.innerText = `Dog Bowl: ${properties.dog_bowl ? 'Yes' : 'No'}`;
          container.appendChild(dogBowl);
      
          const bottleTap = document.createElement('p');
          bottleTap.innerText = `Bottle Refill Tap: ${properties.bottle_refill_tap ? 'Yes' : 'No'}`;
          container.appendChild(bottleTap);
        } else if (properties.type === 'Attraction') {
          const intro = document.createElement('p');
          intro.innerText = truncateText(properties.introduction || 'No introduction available', 400); // 限制介绍为100字符
          container.appendChild(intro);
      
          const image = document.createElement('img');
          image.src = properties.picture || '';
          image.alt = properties.name || 'Image';
          image.style.width = '100%';
          image.style.height = 'auto';
          container.appendChild(image);
        } else {
          const address = document.createElement('p');
          address.innerText = `Address: ${truncateText(properties.address || 'No address available', 80)}`;
          container.appendChild(address);
      
          const hours = document.createElement('p');
          hours.innerText = properties.opening_hours || 'No opening hours available';
          container.appendChild(hours);
      
          const shower = document.createElement('p');
          shower.innerText = `Shower: ${properties.shower ? 'Yes' : 'No'}`;
          container.appendChild(shower);
      
          const dumpPoint = document.createElement('p');
          dumpPoint.innerText = `Dump Point: ${properties.dump_point ? 'Yes' : 'No'}`;
          container.appendChild(dumpPoint);
        }
  
        // 途经点按钮逻辑
        const isWaypoint = waypoints.some(wp => wp[0] === coordinates[0] && wp[1] === coordinates[1]);
        const button = document.createElement('button');
        button.innerText = isWaypoint ? 'Delete' : 'Add';
        button.style.backgroundColor = isWaypoint ? '#ef4444' : '#3b82f6';
        button.style.color = 'white';
        button.style.padding = '8px 16px';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.marginTop = '10px';
        button.style.cursor = 'pointer';
  
        button.onclick = () => {
          if (isWaypoint) {
            const index = waypoints.findIndex(wp => wp[0] === coordinates[0] && wp[1] === coordinates[1]);
            if (index !== -1) {
              removeWaypoint(index);
            }
          } else {
            addWaypoint(coordinates[1], coordinates[0], feature);
          }
        };
  
        container.appendChild(button);
  
        return container;
      };
      
      
    }

    // if (mapRef.current) {
    //   // Remove existing directions control
    //   console.log('2');
    //   if (directionsRef.current) {
    //     mapRef.current.removeControl(directionsRef.current);
    //     directionsRef.current = null;
    //   }
    //   // Initialize new directions control with updated transport mode
    //   initializeDirections();
    // }
  }, [addWaypoint, waypoints]);

  useEffect(() => {
    const addFountainsLayer = (map: mapboxgl.Map, data: GeoJSONData) => {
      const filteredData = {
        ...data,
        features: data.features.filter(feature => {
          // If no type is selected, show all features
          if (selectedType === null) {
            return true;
          }

          // First, filter by selected type
          if (selectedType === 'fountain' && feature.properties.type !== 'Fountain') {
            return false;
          }
          if (selectedType === 'toilet' && (feature.properties.type == 'Fountain' || feature.properties.type == 'Attraction')) {
            return false;
          }
          if (selectedType === 'attraction' && feature.properties.type !== 'Attraction') {
            return false;
          }
          
          if (feature.properties.type === 'Fountain') {
            return (!filterDogBowl || feature.properties.dog_bowl) &&
                   (!filterBottleTap || feature.properties.bottle_refill_tap);
          } else if (feature.properties.type === 'Attraction') {
            return true; // No specific filters for attractions
          } else if (feature.properties.type !== 'Fountain' && feature.properties.type !== 'Attraction') {
            return (!filterDP || feature.properties.dump_point) &&
                   (!filterShower || feature.properties.shower) &&
                   (!filterParking || feature.properties.parking) &&
                   (!filterAccessible || feature.properties.accessible) &&
                   (!filterMale || feature.properties.male) &&
                   (!filterFemale || feature.properties.female) &&
                   (!filterAC || feature.properties.adult_change) &&
                   (!filterBC || feature.properties.baby_care_room);
          }
          return false;
        })
      };

        // load icon
      const showerImg = new Image(20, 20);
      showerImg.onload = () => {
        map.addImage('shower-icon', showerImg);
      };
      showerImg.src = showerIconPath;

      const fountainImg = new Image(20, 20);
      fountainImg.onload = () => {
        map.addImage('fountain-icon', fountainImg);
      };
      fountainImg.src = fountainIconPath;

      const attractionImg = new Image(20, 20);
      attractionImg.onload = () => {
        map.addImage('attraction-icon', attractionImg);
      };
      attractionImg.src = attractionIconPath;

      const dumpPointImg = new Image(20, 20);
      dumpPointImg.onload = () => {
        map.addImage('dump-point-icon', dumpPointImg);
      };
      dumpPointImg.src = dumpPointIconPath;

  
      // 检查是否有可显示的点
      if (filteredData.features.length === 0) {
        setIsNoDataDialogOpen(true);
      } else {
        setIsNoDataDialogOpen(false);
      }
  
      if (map.getSource('places')) {
        (map.getSource('places') as mapboxgl.GeoJSONSource).setData(filteredData);
      } else {
        map.addSource('places', {
          type: 'geojson',
          data: filteredData,
          cluster: true,
          clusterMaxZoom: 10, // 最大的聚类缩放
          clusterRadius: 50,  // 聚类的半径
        });
  
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

      // icon
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

            'default-icon'
          ],
          'icon-size': 1,  
          'icon-allow-overlap': false,  
        },
      });
      }
    };
  
    if (mapRef.current && data) {
      console.log('here');
      addFountainsLayer(mapRef.current, data);
    }
  }, [data, filterDogBowl, filterBottleTap, filterDP, filterShower, filterParking, filterAccessible, filterMale, filterFemale, filterAC, filterBC, selectedType]);
  
  const handleSearch = () => {
    // initializeDirections(transportMode);
    
      let isValid = true;
  
      if (!origin || (origin !== 'Current Location' && !originAutocompleteRef.current?.getPlace())) {
        setOriginError('Please enter a valid origin');
        isValid = false;
      } else {
        setOriginError('');
      }
  
      if (!destination || !autocompleteRef.current?.getPlace()) {
        setDestinationError('Please enter a valid destination');
        isValid = false;
      } else {
        setDestinationError('');
      }
  
      if (!isValid) return;
  
      if (autocompleteRef.current && originAutocompleteRef.current) {
        const destPlace = autocompleteRef.current.getPlace();
        const originPlace = originAutocompleteRef.current.getPlace();
  
        if (destPlace.geometry && destPlace.geometry.location) {
          const lat = destPlace.geometry.location.lat();
          const lng = destPlace.geometry.location.lng();
          directionsRef.current?.setDestination([lng, lat]);
          console.log('destination', lng, lat);
        }
  
        if (origin === 'Current Location') {
          navigator.geolocation.getCurrentPosition((position) => {
            const { longitude, latitude } = position.coords;
            directionsRef.current?.setOrigin([longitude, latitude]);
            console.log('origin', longitude, latitude);
          });
        } else if (originPlace.geometry && originPlace.geometry.location) {
          const lat = originPlace.geometry.location.lat();
          const lng = originPlace.geometry.location.lng();
          directionsRef.current?.setOrigin([lng, lat]);
        }
  
        // updateDirections();
      }
  };

  // const updateDirections = () => {
  //   if (directionsRef.current) {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     directionsRef.current.on('route', (e: any) => {
  //       setDirections(e.route[0]);
  //       mapRef.current?.resize();
  //     });
  //   }
  // };

  // const handleNext = () => {
  //   setStep(2);
  // };

  const handleReset = () => {
    setOrigin('Current Location');
    setDestination('');
    setWaypoints([]);
    setWaypointInfo([]);
    setStep(1);
    setDirections(null);
    if (directionsRef.current) {
      directionsRef.current.removeRoutes(); 
    }
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [144.9631, -37.8136],
        zoom: 6
      });
    }
  };

  // 初始化 MapboxDirections 控制器的函数
// const initializeDirections = (mode: 'driving' | 'walking' | 'cycling') => {
//   if (!mapRef.current) return;

//   // 如果已经存在方向控制器，则先移除
//   if (directionsRef.current) {
//     console.log('remove');
//     mapRef.current.removeControl(directionsRef.current);
//   }

//   // 初始化新的 MapboxDirections 控制器
//   directionsRef.current = new MapboxDirections({
//     accessToken: mapboxgl.accessToken,
//     unit: 'metric',
//     profile: `mapbox/${mode}`,  // 根据不同的 mode 重新设置 profile
//     interactive: false,
//     controls: {
//       // inputs: false,  // 隐藏搜索框
//       instructions: true,
//       profileSwitcher: true
//     },
//     country: 'au',
//   });

//   // 添加新的控制器到地图
//   console.log('add');
//   mapRef.current.addControl(directionsRef.current, 'top-left');

  

//   // 设置起点为当前地理位置
//   // if (navigator.geolocation) {
//   //   navigator.geolocation.getCurrentPosition((position) => {
//   //     const { longitude, latitude } = position.coords;
//   //     directionsRef.current?.setOrigin([longitude, latitude]);
//   //   });
//   // }
// };

  // Function to handle transport mode change
  // const handleTransportModeChange = (mode: 'driving' | 'walking' | 'cycling') => {
  //   setTransportMode(mode);
    
    
    
  //   // handleSearch(); 

  //   // Update directions profile when changing transport mode
  //   // if (directionsRef.current) {
  //   //   directionsRef.current.setProfile(`mapbox/${mode}`);
  //   // }
  // };

  // const initializeMap = () => {
  //   // 这里放置地图初始化的代码
  //   // ... existing map initialization code ...
  // };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Panel */}
      <div className="w-full md:w-1/3 p-4 overflow-y-auto">
      <h1 className='pt-10 text-2xl sm:text-4xl text-center'>Customized Travel Route</h1>
          <div className="mt-4 text-center">
            <Link to="/ai" className="text-blue-500 underline text-sm sm:text-base">
              <Button className='bg-blue-500'>Have no idea? Get some advice from smart assistant</Button>
            </Link>
          </div>
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold my-4">Step 1: Set Your Destination</h2>
            <Input
              id="origin-input"
              type="text"
              placeholder="Enter starting point"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className={`mb-2 ${originError ? 'border-red-500' : ''}`}
            />
            {originError && <p className="text-red-500 text-sm mb-2">{originError}</p>}
            <Input
              id="destination-input"
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={`mb-2 ${destinationError ? 'border-red-500' : ''}`}
            />
            {destinationError && <p className="text-red-500 text-sm mb-2">{destinationError}</p>}
            {/* <p className='text-red-900 my-2'>Double Click to Switch Transport Mode!</p>
            <div className="flex space-x-2 mb-4">
              
              <Button
                variant={transportMode === 'driving' ? 'default' : 'outline'}
                onClick={() => handleTransportModeChange('driving')}
              >
                Driving
              </Button>
              <Button
                variant={transportMode === 'walking' ? 'default' : 'outline'}
                onClick={() => handleTransportModeChange('walking')}
              >
                Walking
              </Button>
              <Button
                variant={transportMode === 'cycling' ? 'default' : 'outline'}
                onClick={() => handleTransportModeChange('cycling')}
              >
                Cycling
              </Button>
            </div> */}
            <Button onClick={handleSearch} className="w-full mb-2 bg-blue-300">Search</Button>
            {/* {directions && <Button onClick={handleNext} className="w-full">Next</Button>} */}
          </div>
        )}

<div>
            <h2 className="text-xl font-semibold mb-4 mt-10">Step 2: Select Your Preferred Amenities</h2>
                  {/* Filters */}
      <div className="bg-gray-100 rounded-lg  p-6 md: w-full">
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
                <Button
                  onClick={() => handleTypeChange('attraction')}
                  variant={selectedType === 'attraction' ? 'default' : 'outline'}
                  className="text-sm md:text-base"
                >
                  Attraction
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

              {selectedType === 'attraction' && (
                <div className="text-center text-gray-500">
                  No specific filters for attractions
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <h2 className="text-xl font-semibold mt-10 mb-2">Step 3: Add Passing Points to Your Route</h2>
          {waypointInfo.length > 0 ? (
            <div>
              <h3 className="font-semibold mb-2">Passing Points:</h3>
              <ul className="space-y-2">
                {waypointInfo.map((waypoint, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <div className="flex items-center">
                      <img 
                        src={
                          waypoint.type === 'Fountain' ? fountainIconPath :
                          waypoint.type === 'Attraction' ? attractionIconPath :
                          waypoint.sub_type === 'Shower' ? showerIconPath :
                          waypoint.sub_type === 'Dump Point' ? dumpPointIconPath :
                          fountainIconPath
                        } 
                        alt={waypoint.type} 
                        className="w-6 h-6 mr-2" 
                      />
                      <span>{waypoint.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWaypoint(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Click amenity point on the map to add them here</p>
          )}
          {directions && (
            <div className="mt-4">
              <p>Total distance: {(directions.distance / 1000).toFixed(2)} km</p>
              <p>Estimated time: {Math.round(directions.duration / 60)} minutes</p>
            </div>
          )}
          <Button onClick={handleReset} className="w-full mt-4 bg-gray-600">Reset</Button>
          </div>
      </div>

      {/* Right Panel (Map) */}
      <div className="w-full md:w-2/3 h-full">
        <div ref={mapContainerRef} className="w-full h-full"></div>
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