import express from 'express';
import cors from 'cors';

const authController = require('./../controllers/authController');

const reviewController = require('./../controllers/reviewController');

const router = express.Router();

// routes:
router.options('/getAllReviews', cors());
router.get('/getAllReviews', cors(), reviewController.getAllReviews);

router.options('/:slug', cors());
router.get('/:slug', cors(), reviewController.getReview);

router.post(
  '/createReview',
  authController.protect,
  reviewController.createReview
);

module.exports = router;
