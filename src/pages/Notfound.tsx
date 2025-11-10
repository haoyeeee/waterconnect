import 'aos/dist/aos.css'; 

export default function Notfound() {
      return (
        <div className="flex flex-col min-h-screen bg-sky-50">
            <section id="services" className="services section py-12 md:py-20 ">
            {/* Section Title */}
                <div className="container mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-blue-900">404</h2>
                </div>
            
                <div className="container mx-auto text-center mb-12 max-w-3xl">
                    <p className="font-bold mb-4 text-lg text-blue-950">
                    Oops! Page Not Found.
                    </p>
                </div>
            </section>
        </div>
      );
}