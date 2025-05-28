import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from '@heroicons/react/20/solid'

interface datatype {
    heading: string;
    imgSrc: string;
    paragraph: string;
    // link: string;
}

const Aboutdata: datatype[] = [
    {
        heading: "About us.",
        imgSrc: "/images/aboutus/imgOne.svg",
        paragraph: 'Our platform is dedicated to supporting individuals with social phobia by offering a safe and understanding environment. Through our chatbot, users can access Cognitive Behavioral Therapy (CBT) strategies, engage in meaningful conversations, and gradually overcome social anxieties. We are committed to helping you step into a more confident and fulfilling life.',
        // link: 'Learn more'
    },
    {
        heading: "Services.",
        imgSrc: "/images/aboutus/imgTwo.svg",
        paragraph: 'We provide 24/7 guidance tailored for those dealing with social phobia. Our services include advice for managing symptoms, confidential assistance in finding medical solutions, and direct contact with trusted professionals. Rest assured, all your interactions are 100% private and handled with utmost care.',
        // link: 'Learn more'
    },
    {
        heading: "Our Works.",
        imgSrc: "/images/aboutus/imgThree.svg",
        paragraph: 'Thousands of individuals have connected with us, and their journey toward improved mental well-being is our greatest achievement. Many patients have shared how their confidence has grown and their mental health has flourished. Join us and take the first step toward a brighter future.',
        // link: 'Learn more'
    },
]

const Aboutus = () => {
    return (

        <div id="aboutus-section">
            <div className='mx-auto max-w-7xl px-4 py-24 my-28 lg:px-10 bg-lightgrey rounded-3xl relative'>
                <Image src="/images/aboutus/dots.svg" width={100} height={100} alt="dots-image" className="absolute bottom-1 -left-20" />
                {/* <h3 className='text-center text-blue text-lg tracking-widest'>ABOUT US</h3> */}
                <h4 className='text-center text-4xl lg:text-65xl font-bold'>Know more about us.</h4>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16 lg:gap-x-32'>
                    {Aboutdata.map((item, i) => (
                        <div key={i} className='hover:bg-navyblue bg-white rounded-3xl mt-16 pt-10 pl-8 pb-10 pr-6 shadow-xl group'>
                            <h4 className='text-4xl font-semibold  text-black mb-5 group-hover:text-white'>{item.heading}</h4>
                            <Image src={item.imgSrc} alt={item.imgSrc} width={100} height={100} className="mb-5" />
                            <h4 className='text-lg font-normal text-black group-hover:text-offwhite mb-5 text-center'>{item.paragraph}</h4>
                            {/* <Link href="#" className='text-lg font-semibold group-hover:text-white text-blue hover-underline'>
                                {item.link}
                                <ChevronRightIcon width={20} height={20} />
                            </Link> */}
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}

export default Aboutus;