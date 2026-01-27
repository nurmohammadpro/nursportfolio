"use client";

import Card from "./components/Card";

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <Card
        heading="Welcome to My Portfolio"
        topSubHeading="Hello there!"
        bottomSubHeading="Let's checkout the content"
        description="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        imageUrl="https://images.pexels.com/photos/27219791/pexels-photo-27219791.jpeg?cs=srgb&dl=pexels-imvitordiniz-27219791.jpg&fm=jpg&w=640&h=960"
      />
    </div>
  );
}
