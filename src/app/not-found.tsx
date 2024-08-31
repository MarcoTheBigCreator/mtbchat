import Image from 'next/image';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16 w-screen h-screen bg-white dark:bg-neutral-900">
      <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
        <div className="relative">
          <div className="absolute">
            <div className="">
              <h1 className="my-2 text-gray-800 dark:text-indigo-700 font-bold text-2xl">
                {`Looks like you\'ve found the doorway to the great nothing`}
              </h1>
              <p className="my-2 text-gray-800 dark:text-gray-500 font-semibold mb-8">
                Sorry about that! Please visit your dashboard to get where you
                need to go.
              </p>
              <Link
                href="/dashboard"
                className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
              >
                Take me there!
              </Link>
            </div>
          </div>
          <div>
            <Image
              src="https://i.ibb.co/G9DC8S0/404-2.png"
              alt="404 image"
              quality={100}
              width={500}
              height={190}
            />
          </div>
        </div>
      </div>
      <div>
        <Image
          src="https://i.ibb.co/ck1SGFJ/Group.png"
          alt="404 plug"
          quality={100}
          width={539}
          height={400}
        />
      </div>
    </div>
  );
}
