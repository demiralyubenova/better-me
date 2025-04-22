import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-300 text-black py-7">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Better Me. All rights reserved.
        </p>
        <p className="text-sm mt-2">
          <Link href="/privacy-policy" className="text-black hover:underline">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link href="/terms-of-service" className="text-black hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;