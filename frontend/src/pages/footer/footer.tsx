import { MainFooter, NewsLetterSection } from "./footer_function/index";

export const Footer = () => {
  return (
    <footer className="bg-dark text-white bottom-0 left-0 w-full z-50">
        <NewsLetterSection />
        <MainFooter />
    </footer>
  );
};
