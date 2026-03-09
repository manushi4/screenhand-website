import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/screenhand-logo.png"
            alt="ScreenHand"
            width={24}
            height={24}
          />
          <span className="text-white/30 text-sm">
            © {new Date().getFullYear()} Clazro Technology Pvt. Ltd. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-white/30">
          <a
            href="https://github.com/manushi4/Screenhand"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-glow transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/screenhand"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-glow transition-colors"
          >
            npm
          </a>
          <span>AGPL-3.0</span>
        </div>
      </div>
    </footer>
  );
}
