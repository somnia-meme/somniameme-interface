import { memo, useState } from "react";
import { ContainerWrapper } from "../wrapper/container-wrapper";
import { useIsActiveRoute } from "@/hooks/use-is-active-route";
import { NavRoutes } from "./routes";
import { Button } from "../ui/form/button";
import { FaPlus, FaBars, FaStar, FaWallet } from "react-icons/fa6";
import { RowWrapper } from "../wrapper/row-wrapper";
import clsx from "clsx";
import { Link, useNavigate } from "react-router";
import { FaTimes } from "react-icons/fa";
import { useAccount } from "wagmi";
import { formatAddress } from "@/lib/utils/format-address";
import { useAppKit } from "@reown/appkit/react";

function NavbarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-sm">
      <ContainerWrapper isLayout={true}>
        <div className="py-6">
          <nav className="flex items-center w-full">{children}</nav>
        </div>
      </ContainerWrapper>
    </div>
  );
}

function NavbarItem({
  label,
  href,
  featured,
}: {
  label: string;
  href: string;
  featured?: boolean;
}) {
  const isActiveRoute = useIsActiveRoute(href);
  return (
    <Link
      to={href}
      className={clsx(
        "flex items-center gap-2 !text-sm",
        isActiveRoute(href) ? "text-white" : "text-white/50",
        featured &&
          "bg-gradient-to-r from-[var(--primary-light)] to-[var(--secondary)] bg-clip-text text-transparent"
      )}
    >
      {featured && <FaStar className="text-yellow-500" />}
      {label}
    </Link>
  );
}

export const Navbar = memo(() => {
  const { open } = useAppKit();
  const account = useAccount();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-[var(--primary-darker)]/60 text-xs py-1 text-center text-white/80">
        This is running on testnet. If you encounter any issues, please reach
        out via{" "}
        <a
          href="https://x.com/alosha_i"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          Twitter (@alosha_i)
        </a>
        .
      </div>
      <NavbarWrapper>
        <h1
          onClick={() => {
            navigate("/");
          }}
          className="text-xl font-bold bg-gradient-to-r from-[var(--primary-light)] to-[var(--secondary)] bg-clip-text text-transparent cursor-pointer -mt-1"
        >
          Somnia.meme
        </h1>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 ml-auto"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center gap-6 ml-12">
          {NavRoutes.map((route) => (
            <NavbarItem
              key={route.href}
              label={route.label}
              href={route.href}
              featured={route.featured}
            />
          ))}
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm md:hidden p-4">
            <div className="flex flex-col gap-4">
              {NavRoutes.map((route) => (
                <NavbarItem
                  key={route.href}
                  label={route.label}
                  href={route.href}
                  featured={route.featured}
                />
              ))}
              <Button
                variant="gradient"
                leftIcon={<FaPlus />}
                onClick={() => {
                  navigate("/launch");
                  setIsMobileMenuOpen(false);
                }}
              >
                Launch your token
              </Button>
              <Button
                onClick={() => open()}
                variant="gradient"
                size="lg"
                leftIcon={<FaWallet />}
              >
                {account.isConnected
                  ? formatAddress(account.address as string)
                  : "Connect"}
              </Button>
            </div>
          </div>
        )}

        {/* Desktop Buttons */}
        <RowWrapper items_center custom_class="gap-4 hidden md:flex ml-auto">
          <Button
            variant="success"
            leftIcon={<FaPlus />}
            onClick={() => {
              navigate("/launch");
            }}
            size="sm"
          >
            Launch your token
          </Button>
          <Button
            leftIcon={<FaWallet />}
            size="sm"
            variant="primary"
            onClick={() => open()}
          >
            {account.isConnected
              ? formatAddress(account.address as string)
              : "Connect"}
          </Button>
        </RowWrapper>
      </NavbarWrapper>
    </>
  );
});
