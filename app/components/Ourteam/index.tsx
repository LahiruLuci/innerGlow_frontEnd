import Image from "next/image";


const index = () => {
    return (
        <div className='mx-auto max-w-7xl sm:py-4 lg:px-8 m-32'>
            <h3 className="text-4xl sm:text-65xl font-bold text-center">Empowering Your Vision with <br/> Innovation.</h3>
            <h4 className="text-2xl font-medium text-center pt-10 opacity-50">Delivering cutting-edge solutions tailored to meet your needs, <br/>fostering growth and success in every project.</h4>
            <div className='grid grid-cols-1 my-16'>
                <Image src="/images/team/teamimg.png" alt="office-image" height={684} width={1296} />
            </div>
        </div>
    )
}

export default index;
