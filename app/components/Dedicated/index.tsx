import Image from "next/image";

const Dedicated = () => {
    return (
        <div className="relative">

            <Image src="/images/dedicated/spiral.svg" height={272} width={686} alt="spiral-design" className="absolute left-0 hidden lg:block -z-10" />

            <div className='mx-auto max-w-7xl px-4 my-40 sm:py-20 lg:px-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 my-16'>

                    {/* COLUMN-1 */}
                    <div>
                        <Image src="/images/dedicated/new.jpg" alt="man-icon" width={550} height={500} className="mx-auto md:mx-0 rounded-lg" />
                    </div>

                    {/* COLUMN-2 */}
                    <div className="relative">
                        <Image src="images/dedicated/comma.svg" alt="comma-image" width={200} height={106} className="absolute comma-pos hidden lg:block" />
                        <h2 className="text-2xl lg:text-50xl pt-4 font-bold sm:leading-tight mt-5 text-center lg:text-start">Dedicated to Your Growth.</h2>
                        <p className="font-medium text-lightblack text-2xl mt-5 text-center lg:text-start">Our goal is to provide a safe, understanding space for individuals with social phobia. Together, we build confidence, step by step.</p>
                        <div className='my-7 text-center lg:text-start'>
                            <button className='text-sm md:text-xl font-semibold hover:shadow-xl bg-blue text-white py-3 px-6 md:py-5 md:px-20 rounded-full hover:bg-hoblue'>
                                Get Started
                            </button>
                        </div>
                    </div>

                    

                </div>
            </div>

        </div>
    )
}

export default Dedicated;
