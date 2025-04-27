import { MainFooter, NewsLetterSection } from "./footer_function/index";

export const Footer = () => {
  return (
    <footer className="bg-dark text-white">
      <NewsLetterSection />
      <MainFooter />
    </footer>
  );
};
