import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Shield, CheckCircle, Award } from "lucide-react";

interface HelperCardProps {
  helper: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    specialties: string[];
    distance?: string;
    availability?: string;
    verificationBadges: {
      backgroundCheck: boolean;
      identityVerified: boolean;
      skillsCertified: boolean;
      trainingCompleted: boolean;
    };
  };
  onSelect?: () => void;
  selected?: boolean;
}

const HelperCard: React.FC<HelperCardProps> = ({
  helper,
  onSelect,
  selected = false,
}) => {
  return (
    <Card
      className={`overflow-hidden transition-all ${
        selected
          ? "border-primary ring-2 ring-primary ring-opacity-50"
          : "hover:border-primary/50"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage src={helper.avatar} alt={helper.name} />
            <AvatarFallback>{helper.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-medium text-lg">{helper.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(helper.rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{helper.rating}</span>
                <span className="text-sm text-gray-500">
                  ({helper.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {helper.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {helper.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{helper.specialties.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              {helper.distance && (
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{helper.distance}</span>
                </div>
              )}
              {helper.availability && (
                <div className="flex items-center gap-1 text-green-600">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{helper.availability}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {helper.verificationBadges.backgroundCheck && (
                <Badge
                  variant="outline"
                  className="bg-green-50 border-green-200 text-green-700 text-xs flex items-center gap-1"
                >
                  <Shield className="h-3 w-3" />
                  Background Check
                </Badge>
              )}
              {helper.verificationBadges.identityVerified && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 border-blue-200 text-blue-700 text-xs flex items-center gap-1"
                >
                  <CheckCircle className="h-3 w-3" />
                  ID Verified
                </Badge>
              )}
              {helper.verificationBadges.skillsCertified && (
                <Badge
                  variant="outline"
                  className="bg-purple-50 border-purple-200 text-purple-700 text-xs flex items-center gap-1"
                >
                  <Award className="h-3 w-3" />
                  Skills Certified
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t">
          <Button
            onClick={onSelect}
            className="w-full"
            variant={selected ? "default" : "outline"}
          >
            {selected ? "Selected" : "Select Helper"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelperCard;