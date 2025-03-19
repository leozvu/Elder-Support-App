import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Shield, Award, CheckCircle, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface HelperInfo {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  distance?: string;
  availability?: string;
  verificationBadges?: {
    backgroundCheck?: boolean;
    identityVerified?: boolean;
    skillsCertified?: boolean;
    trainingCompleted?: boolean;
  };
}

interface HelperCardProps {
  helper: HelperInfo;
  onSelect?: () => void;
  selected?: boolean;
  compact?: boolean;
}

const HelperCard = ({
  helper,
  onSelect,
  selected = false,
  compact = false,
}: HelperCardProps) => {
  const { t } = useTranslation();

  const renderVerificationBadges = () => {
    if (!helper.verificationBadges) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        <TooltipProvider>
          {helper.verificationBadges.backgroundCheck && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="bg-green-50 border-green-200 text-green-700 flex items-center gap-1"
                >
                  <Shield className="h-3 w-3" />
                  {t("helper.badges.backgroundCheck")}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("helper.badges.backgroundCheckDesc")}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {helper.verificationBadges.identityVerified && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="bg-blue-50 border-blue-200 text-blue-700 flex items-center gap-1"
                >
                  <CheckCircle className="h-3 w-3" />
                  {t("helper.badges.identityVerified")}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("helper.badges.identityVerifiedDesc")}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {helper.verificationBadges.skillsCertified && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="bg-purple-50 border-purple-200 text-purple-700 flex items-center gap-1"
                >
                  <Award className="h-3 w-3" />
                  {t("helper.badges.skillsCertified")}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("helper.badges.skillsCertifiedDesc")}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {helper.verificationBadges.trainingCompleted && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="bg-amber-50 border-amber-200 text-amber-700 flex items-center gap-1"
                >
                  <Award className="h-3 w-3" />
                  {t("helper.badges.trainingCompleted")}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("helper.badges.trainingCompletedDesc")}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
    );
  };

  if (compact) {
    return (
      <Card
        className={`overflow-hidden ${selected ? "ring-2 ring-primary" : ""}`}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={helper.avatar} alt={helper.name} />
              <AvatarFallback>{helper.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="font-medium truncate">{helper.name}</p>
                {helper.verificationBadges?.backgroundCheck && (
                  <Shield className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                <span>{helper.rating}</span>
                <span className="mx-1">•</span>
                <span>{helper.distance}</span>
              </div>
            </div>
            {onSelect && (
              <Button
                size="sm"
                onClick={onSelect}
                variant={selected ? "default" : "outline"}
              >
                {selected ? t("common.selected") : t("common.select")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`overflow-hidden ${selected ? "ring-2 ring-primary" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={helper.avatar} alt={helper.name} />
            <AvatarFallback className="text-lg">
              {helper.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{helper.name}</h3>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 font-medium">{helper.rating}</span>
                <span className="text-gray-500 text-sm ml-1">
                  ({helper.reviewCount} {t("reviews")})
                </span>
              </div>
              {helper.distance && (
                <div className="flex items-center ml-4">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="ml-1 text-gray-500">{helper.distance}</span>
                </div>
              )}
            </div>

            {renderVerificationBadges()}

            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {helper.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            {helper.availability && (
              <p className="text-sm text-gray-500 mt-2">
                {t("helper.availability")}: {helper.availability}
              </p>
            )}

            {onSelect && (
              <div className="mt-3">
                <Button
                  onClick={onSelect}
                  variant={selected ? "default" : "outline"}
                >
                  {selected ? t("common.selected") : t("common.select")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelperCard;
