import Image from "next/image";

type BrandIdentityProps = Readonly<{
  name: string;
  descriptor: string;
  locale: string;
  priority?: boolean;
}>;

export function BrandIdentity({
  name,
  descriptor,
  locale,
  priority = false,
}: BrandIdentityProps) {
  return (
    <>
      <span className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-carbon-base leading-none lg:h-14 lg:w-14 lg:basis-14">
        <Image
          src="/brand/anan-sustainability-icon.png"
          width={30}
          height={42}
          alt=""
          aria-hidden="true"
          priority={priority}
          className="block h-10 w-7 object-contain"
        />
      </span>
      <span
        className={`flex min-w-0 flex-col gap-2xs text-start ${locale === "ar" ? "font-arabic" : ""}`}
      >
        <span
          className={`font-semibold leading-tight text-text-pure ${
            locale === "ar"
              ? "font-arabic text-body-lg"
              : "font-display text-headline-sm"
          }`}
        >
          {name}
        </span>
        <span
          className={`leading-tight text-primary ${
            locale === "ar"
              ? "font-arabic text-body-sm"
              : "font-mono text-label-mono-sm uppercase tracking-[0.18em]"
          }`}
        >
          {descriptor}
        </span>
      </span>
    </>
  );
}
