import { Icons, LoginForm } from '@/components';
import { titleFont } from '@/config/fonts';

export default function LoginPage() {
  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center max-w-md space-y-8">
          <div className="flex flex-col items-center gap-8">
            <div className="flex h-16 shrink-0 items-center my-4 ">
              <Icons.Logo className="h-12 w-12 text-black " />
            </div>
            <h2
              className={`${titleFont.className} mt-6 text-center text-3xl font-bold tracking-tight text-gray-900`}
            >
              Sign in to your account
            </h2>
          </div>

          {/* Form */}
          <LoginForm />
        </div>
      </div>
    </>
  );
}
