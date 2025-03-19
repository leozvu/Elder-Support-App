import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  DollarSign,
  FileText,
  HelpCircle,
  Home,
  Heart,
  Phone,
  Search,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { speak } from "@/lib/voice-guidance";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  icon: React.ReactNode;
}

const FinancialResourcesPanel = () => {
  const resources: Resource[] = [
    {
      id: "1",
      title: "Medicare Savings Programs",
      description:
        "Help with Medicare premiums, deductibles, and copayments for eligible seniors.",
      url: "https://www.medicare.gov/your-medicare-costs/get-help-paying-costs/medicare-savings-programs",
      category: "Healthcare",
      tags: ["Medicare", "Financial Assistance", "Healthcare"],
      icon: <Heart className="h-5 w-5" />,
    },
    {
      id: "2",
      title: "Supplemental Security Income (SSI)",
      description:
        "Federal income supplement program for aged, blind, and disabled people with limited income and resources.",
      url: "https://www.ssa.gov/ssi/",
      category: "Income",
      tags: ["Social Security", "Income Support", "Disability"],
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      id: "3",
      title: "Low Income Home Energy Assistance Program (LIHEAP)",
      description:
        "Assistance with home energy bills, energy crises, and weatherization for low-income households.",
      url: "https://www.acf.hhs.gov/ocs/low-income-home-energy-assistance-program-liheap",
      category: "Utilities",
      tags: ["Energy Assistance", "Utilities", "Home"],
      icon: <Home className="h-5 w-5" />,
    },
    {
      id: "4",
      title: "Eldercare Locator",
      description:
        "A nationwide service that connects older Americans and their caregivers with local support resources.",
      url: "https://eldercare.acl.gov/Public/Index.aspx",
      category: "General",
      tags: ["Eldercare", "Support Services", "Local Resources"],
      icon: <Phone className="h-5 w-5" />,
    },
    {
      id: "5",
      title: "Benefits CheckUp",
      description:
        "Find benefit programs that help pay for prescription drugs, health care, food, utilities, and more.",
      url: "https://www.benefitscheckup.org/",
      category: "General",
      tags: ["Benefits", "Financial Assistance", "Screening"],
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "6",
      title: "SNAP for Seniors",
      description:
        "Supplemental Nutrition Assistance Program (SNAP) helps eligible seniors buy the food they need for good health.",
      url: "https://www.fns.usda.gov/snap/supplemental-nutrition-assistance-program",
      category: "Food",
      tags: ["Food Assistance", "Nutrition", "SNAP"],
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      id: "7",
      title: "Property Tax Relief for Seniors",
      description:
        "Information about property tax exemptions, deferrals, and other relief programs for senior homeowners.",
      url: "https://www.usa.gov/property-tax-relief",
      category: "Housing",
      tags: ["Property Tax", "Housing", "Tax Relief"],
      icon: <Home className="h-5 w-5" />,
    },
    {
      id: "8",
      title: "Senior Legal Assistance",
      description:
        "Free legal help for seniors with issues related to healthcare, housing, income maintenance, and more.",
      url: "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help",
      category: "Legal",
      tags: ["Legal Aid", "Elder Law", "Assistance"],
      icon: <FileText className="h-5 w-5" />,
    },
  ];

  const categories = [
    "All",
    ...Array.from(new Set(resources.map((r) => r.category))),
  ];

  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredResources = resources.filter(
    (resource) =>
      (selectedCategory === "All" || resource.category === selectedCategory) &&
      (searchQuery === "" ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        resource.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        )),
  );

  const handleResourceClick = (resource: Resource) => {
    // Announce the resource being opened
    speak(`Opening ${resource.title} in a new tab. ${resource.description}`);
    window.open(resource.url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <DollarSign className="mr-2 h-6 w-6 text-primary" />
          Financial Resources for Seniors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                <HelpCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800">
                  About These Resources
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  These trusted resources provide information on financial
                  assistance programs and services available to seniors. Click
                  on any resource to visit their official website for more
                  information.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No resources found matching your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map((resource) => (
                <Card
                  key={resource.id}
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleResourceClick(resource)}
                >
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        {resource.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{resource.title}</h3>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {resource.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {resource.category}
                          </Badge>
                          {resource.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                <HelpCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Need Help?</h3>
                <p className="text-sm text-green-700 mt-1">
                  If you need assistance understanding or applying for any of
                  these programs, you can request help from a trusted helper
                  through the platform. They can guide you through the
                  application process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialResourcesPanel;
