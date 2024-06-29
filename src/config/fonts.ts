import {
  Poppins,
  Outfit,
  Libre_Franklin,
  Montserrat_Alternates,
  Roboto,
  Montserrat_Subrayada,
  Montserrat,
} from 'next/font/google';

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const titleFont = Montserrat({
  subsets: ['latin'],
  weight: ['500', '700'],
});
