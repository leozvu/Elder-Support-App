import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Clock,
  MessageSquare,
  Shield,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ReviewSystemProps {
  userType: "elderly" | "helper";
  recipientId: string;
  recipientName: string;
  serviceId: string;
  serviceType: string;
  onSubmit?: (reviewData: ReviewData) => void;
  onCancel?: () => void;
}

export interface ReviewData {
  rating: number;
  feedback: string;
  categories: {
    punctuality: number;
    communication: number;
    serviceQuality: number;
    respectfulness: number;
  };
  recommendAgain: boolean;
}

const ReviewSystem = ({
  userType,
  recipientId,
  recipientName,
  serviceId,
  serviceType,
  onSubmit,
  onCancel,
}: ReviewSystemProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [punctuality, setPunctuality] = useState<number>(3);
  const [communication, setCommunication] = useState<number>(3);
  const [serviceQuality, setServiceQuality] = useState<number>(3);
  const [respectfulness, setRespectfulness] = useState<number>(3);
  const [recommendAgain, setRecommendAgain] = useState<boolean>(true);

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: t("review.ratingRequired"),
        description: t("review.pleaseSelectRating"),
        variant: "destructive",
      });
      return;
    }

    const reviewData: ReviewData = {
      rating,
      feedback,
      categories: {
        punctuality,
        communication,
        serviceQuality,
        respectfulness,
      },
      recommendAgain,
    };

    if (onSubmit) {
      onSubmit(reviewData);
    }

    toast({
      title: t("review.thankYou"),
      description: t("review.feedbackSubmitted"),
    });
  };

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-8 w-8 cursor-pointer ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    );
  };

  const renderCategoryRating = (
    category: string,
    value: number,
    onChange: (value: number) => void,
    icon: React.ReactNode,
  ) => {
    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <Label>{t(`review.categories.${category}`)}</Label>
        </div>
        <RadioGroup
          className="flex space-x-2"
          value={value.toString()}
          onValueChange={(val) => onChange(parseInt(val))}
        >
          {[1, 2, 3, 4, 5].map((val) => (
            <div key={val} className="flex flex-col items-center">
              <RadioGroupItem
                value={val.toString()}
                id={`${category}-${val}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`${category}-${val}`}
                className="px-3 py-2 rounded-md text-center cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted"
              >
                {val}
              </Label>
              {val === 1 && (
                <span className="text-xs mt-1">{t("review.poor")}</span>
              )}
              {val === 5 && (
                <span className="text-xs mt-1">{t("review.excellent")}</span>
              )}
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {userType === "elderly"
            ? t("review.rateHelper", { name: recipientName })
            : t("review.rateClient", { name: recipientName })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="text-lg mb-2 block">
              {t("review.overallRating")}
            </Label>
            {renderStars()}
          </div>

          <div className="space-y-4">
            <Label className="text-lg block">
              {t("review.categoryRatings")}
            </Label>
            {renderCategoryRating(
              "punctuality",
              punctuality,
              setPunctuality,
              <Clock className="h-5 w-5" />,
            )}
            {renderCategoryRating(
              "communication",
              communication,
              setCommunication,
              <MessageSquare className="h-5 w-5" />,
            )}
            {renderCategoryRating(
              "serviceQuality",
              serviceQuality,
              setServiceQuality,
              <Shield className="h-5 w-5" />,
            )}
            {renderCategoryRating(
              "respectfulness",
              respectfulness,
              setRespectfulness,
              <Star className="h-5 w-5" />,
            )}
          </div>

          <div>
            <Label className="text-lg mb-2 block">
              {t("review.detailedFeedback")}
            </Label>
            <Textarea
              placeholder={t("review.feedbackPlaceholder")}
              className="min-h-[120px]"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-lg mb-2 block">
              {t("review.recommendAgain")}
            </Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={recommendAgain ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => setRecommendAgain(true)}
              >
                <ThumbsUp className="h-5 w-5" />
                {t("review.yes")}
              </Button>
              <Button
                type="button"
                variant={!recommendAgain ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => setRecommendAgain(false)}
              >
                <ThumbsDown className="h-5 w-5" />
                {t("review.no")}
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                {t("common.cancel")}
              </Button>
            )}
            <Button onClick={handleSubmit}>{t("review.submitReview")}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSystem;
