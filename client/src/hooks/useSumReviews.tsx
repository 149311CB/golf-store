import { reviewInterface } from "../types/types";

export const useSumReviews = (id: string, reviews: reviewInterface[]) => {
  return reviews.reduce(
    function (total: any, review: reviewInterface) {
      if (review.golf === id) {
        total.sum++;
        total.average = (total.average + review.rating) / total.sum;
      }
      return total;
    },
    { sum: 0, average: 0 }
  );
};
