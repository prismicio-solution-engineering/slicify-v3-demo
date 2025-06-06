import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export default async function NotFound() {
  return (
    <Container>
      <div className="container dark-copy grow grid md:grid-cols-12 gap-6 items-center py-20">
        <div className="col-span-5">
          <h1 className="text-3xl">Well, this isn’t good...</h1>
          <p className="mt-6 max-w-md text-lg">
            Sorry, the page you were looking for could not be located on this
            site. If you think there is really something missing on this
            website, please contact us.
          </p>
          <nav className="flex items-center flex-wrap gap-4 mt-10">
            <Button href="/" variation="Primary">
              Go back to homepage
            </Button>
          </nav>
        </div>
        <div className="col-span-7">
          <div className="w-full relative scale-[1.14] pb-[100%] ml-[1%]">
            <div className="absolute inset-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full md:-mt-[3vh]"
              >
                <source src="/fourohfour.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
