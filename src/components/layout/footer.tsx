import { memo } from "react";
import { ContainerWrapper } from "../wrapper/container-wrapper";
import { RowWrapper } from "../wrapper/row-wrapper";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { Link, useNavigate } from "react-router";

const SocialIcon = ({
  icon,
  href,
  ariaLabel,
}: {
  icon: React.ReactNode;
  href: string;
  ariaLabel: string;
}) => {
  return (
    <Link
      to={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--primary-darker)]/40 text-[var(--primary-lighter)] hover:bg-[var(--primary-darker)]/60 hover:text-white transition-colors">
        {icon}
      </div>
    </Link>
  );
};

export const Footer = memo(() => {
  const navigate = useNavigate();

  return (
    <footer className="py-8 mt-12 border-t border-[var(--primary)]/20">
      <ContainerWrapper>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-4">
            <h2
              onClick={() => navigate("/")}
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[var(--primary-light)] to-[var(--secondary)] bg-clip-text text-transparent cursor-pointer"
            >
              Somnia.meme
            </h2>
            <p className="text-white/50 text-sm">
              The future of meme tokens on Somnia
            </p>
          </div>

          <RowWrapper items_center custom_class="gap-4">
            <SocialIcon
              icon={<FaTwitter size={18} />}
              href="https://X.com/alosha_i"
              ariaLabel="Twitter"
            />
            <SocialIcon
              icon={<FaGithub size={18} />}
              href="https://github.com/somnia-meme"
              ariaLabel="GitHub"
            />
          </RowWrapper>
        </div>
      </ContainerWrapper>
    </footer>
  );
});

Footer.displayName = "Footer";
