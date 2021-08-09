export const useSumReviews = (id, reviews) => {
  return reviews.reduce(
    function (total, review) {
      if (review.golf === id) {
        total.sum++;
        total.average = (total.average + review.rating) / total.sum;
      }
      return total;
    },
    { sum: 0, average: 0 }
  );
};
