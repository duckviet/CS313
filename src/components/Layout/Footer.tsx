import React from "react";
import { BarChart2, Github, Twitter, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2  ">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2
                className="h-5 w-5 text-primary-600"
                strokeWidth={2.5}
              />
              <h3 className="text-lg font-semibold text-primary-700">
                AirVision
              </h3>
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              Comprehensive air quality monitoring and analysis for better
              environmental insights.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-neutral-500 hover:text-primary-600 transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-primary-600 transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div className="col-span-2">
            <h4 className="font-medium text-neutral-800 mb-3 "> </h4>
            <ul className="space-y-2 flex gap-2 w-full md:justify-between items-center flex-col justify-start md:flex-row">
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-8 pt-6 text-center">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} AirVision. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
