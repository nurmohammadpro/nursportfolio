import Image from "next/image";
import SigninPage from "./(auth)/signin/page";

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <SigninPage />
    </div>
  );
}
