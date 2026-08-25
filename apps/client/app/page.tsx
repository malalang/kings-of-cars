import Image from 'next/image'
import Link from 'next/link'
import { CarFront, Cog, FileText } from 'lucide-react'

const ctaRows = [
  [
    { title: 'Sell Your Car', href: '/sell-your-car', image: '/images/home/cta-sell-your-car.jpg', Icon: CarFront },
    { title: 'All Vehicles', href: '/cars', image: '/images/home/cta-all-vehicles.jpg', Icon: CarFront },
  ],
  [
    { title: 'Finance Solution', href: '/finance', image: '/images/home/cta-finance.jpg', Icon: FileText },
    { title: 'Value Added Products', href: '/value-added-products', image: '/images/home/cta-value-added-products.jpg', Icon: Cog },
  ],
]

export default function HomePage() {
  return (
    <main className="koc-home">
      <section className="koc-hero">
        <Image
          src="/HeroSection.png"
          alt="King of Cars — AA Certified Pre-Owned, a brand you can trust"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      </section>

      <section className="koc-intro">
        <div className="koc-wide">
          <div className="koc-intro-heading">
            <div className="koc-intro-block">
              <Link href="/cars" className="koc-intro-tile" title="Pre-Owned Trichardts Road">
                <Image
                  src="/images/home/intro-preowned-trichardts.jpg"
                  alt="Preowned cars"
                  fill
                  sizes="170px"
                  style={{ objectFit: 'cover' }}
                />
                <span>
                  Pre-Owned
                  <br />
                  Trichardts Road
                </span>
              </Link>
              <a
                href="https://www.kingofcarspremium.co.za/used-vehicles"
                target="_blank"
                rel="noreferrer"
                className="koc-intro-tile"
                title="Pre-Owned Premium"
              >
                <Image
                  src="/images/home/intro-preowned-premium.jpg"
                  alt="Used models"
                  fill
                  sizes="170px"
                  style={{ objectFit: 'cover' }}
                />
                <span>
                  Pre-Owned
                  <br />
                  Premium
                </span>
              </a>
            </div>

            <div className="koc-intro-title">
              <span>Welcome to</span>
              <div className="koc-divider" />
              <h1>King of Cars</h1>
            </div>

            <div className="koc-intro-block">
              <Link href="/sell-your-car" className="koc-intro-tile" title="Sell your car">
                <Image
                  src="/images/home/intro-sell-your-car.jpg"
                  alt="Sell your car"
                  fill
                  sizes="170px"
                  style={{ objectFit: 'cover' }}
                />
                <span>
                  Sell
                  <br />
                  Your Car
                </span>
              </Link>
              <Link href="/contact" className="koc-intro-tile" title="Contact Us">
                <Image
                  src="/images/home/intro-contact-us.jpg"
                  alt="Contact"
                  fill
                  sizes="170px"
                  style={{ objectFit: 'cover' }}
                />
                <span>
                  Contact
                  <br />
                  Us
                </span>
              </Link>
            </div>
          </div>

          <div className="koc-intro-copy">
            <p>
              With 20 years of success in the motor industry, we are a buyer and seller of quality
              used vehicles. With our wide range of experience and skills, we are well equipped to
              assist you with your every need. We offer advice and assistance to all our clients,
              from suggestions on financial solutions to the smart way to buy or sell your vehicle.
            </p>
            <p>
              View the pre-owned cars on offer in the showroom section and find the vehicle that is
              right for you. We have two branches in Boksburg, Premium and North Rand Road ready to
              assist in any way possible. Visit the websites linked below or contact the branches
              directly using the provided contact details.
            </p>
          </div>
        </div>
      </section>

      <section className="koc-branches">
        <div className="koc-wide">
          <div className="koc-branch-row">
            <div className="koc-branch-img">
              <Image
                src="/images/home/branch-trichardts.png"
                alt="King Of Cars Trichardts Road, Boksburg"
                width={860}
                height={400}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <div className="koc-branch-copy">
              <h2>King of Cars Trichardts Road, Boksburg</h2>
              <div className="koc-divider koc-divider-right" />
              <p>
                We have a team that is both experienced and skilled in assisting you with all of
                your motoring needs. We offer free advice and assistance to all our clients, from
                financial solutions to the smart way to buy or sell your vehicle. We&apos;ll help
                you make the car of your dreams a reality! <Link href="/contact">Contact us today!</Link>
              </p>
            </div>
          </div>

          <div className="koc-branch-row">
            <div className="koc-branch-copy">
              <h2>King of Cars Premium</h2>
              <div className="koc-divider koc-divider-left" />
              <p>
                Offering you a wide selection of amazing used cars, King of Cars Premium is here to
                help you achieve all your motoring needs. Our team will make sure that you receive
                the dedicated service that you deserve.{' '}
                <a href="https://www.kingofcarspremium.co.za/contact-us" target="_blank" rel="noreferrer">
                  Contact us today!
                </a>
              </p>
            </div>
            <div className="koc-branch-img">
              <Image
                src="/images/home/branch-premium.png"
                alt="Contact us today"
                width={860}
                height={400}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="koc-help">
        <div className="koc-wide">
          <div className="koc-help-head">
            <h2>How can we help?</h2>
            <div className="koc-divider" />
            <p>
              King of Cars is here to take care of all your motoring needs. We offer advice and
              assistance to all our clients, from suggestions on financial solutions to the smart
              way to buy or sell your vehicle.
            </p>
          </div>
          {ctaRows.map((row, rowIndex) => (
            <div className="koc-help-row" key={rowIndex}>
              {row.map(({ title, href, image, Icon }) => (
                <div className="koc-help-box" key={title}>
                  <Link href={href} className="koc-help-box-link" title={title}>
                    <span className="koc-help-box-img" style={{ backgroundImage: `url(${image})` }} />
                    <span className="koc-help-box-content">
                      <Icon />
                      <span className="copy">{title}</span>
                      <span className="copy-cta">Find Out More</span>
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="koc-news">
        <div className="koc-wide">
          <div className="koc-help-head">
            <h2>Motoring News</h2>
            <div className="koc-divider" />
            <p>Read the latest motoring news on our website by clicking an article below.</p>
          </div>
          <Link href="/articles" className="koc-button koc-button-primary">
            View Articles
          </Link>
        </div>
      </section>
    </main>
  )
}
