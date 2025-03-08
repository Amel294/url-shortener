import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import Track from "@/components/Shortener";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title({ color: "violet" })}>Shrink it.&nbsp;</span>
          <span className={title()}>Share it.&nbsp;</span>
          <br />
          <span className={title({ color: "violet" })}>
            Who&apos;s clicking?
          </span>
          <br />
          <span className={title()}>We know.</span>
          <div className={subtitle({ class: "mt-4" })}>
            We don’t stalk users. Just count clicks by country.
          </div>
        </div>

        {/* <div className="flex gap-3">

          <Link
            isExternal
            className={buttonStyles( { variant: "bordered", radius: "full" } )}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div> */}

        <div className="mt-8">
          <Track />
        </div>
      </section>
    </DefaultLayout>
  );
}
