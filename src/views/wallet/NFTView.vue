<script>
import 'swiper/swiper.min.css';
import 'swiper/swiper-bundle.min.css';
import { useToast } from 'vue-toastification';
import gsap from 'gsap';
// eslint-disable-next-line import/no-unresolved
import { Swiper, SwiperSlide } from 'swiper/vue';
/*
import Cat1 from '../assets/nft/cat1.jpg';
import Cat2 from '../assets/nft/cat2.jpg';
import Cat3 from '../assets/nft/cat3.jpg';
import Cat4 from '../assets/nft/cat4.jpg'; */

export default {
  setup() {
    const toast = useToast();
    const nfts = JSON.parse(localStorage.getItem('nfts')) || [
      { tokenID: 1, img: 'https://placeimg.com/400/225/arch', attrs: 'asd' },
      { tokenID: 1, img: 'https://placeimg.com/400/225/arch', attrs: 'asd' },
      { tokenID: 1, img: 'https://placeimg.com/400/225/arch', attrs: 'asd' },
      { tokenID: 1, img: 'https://placeimg.com/400/225/arch', attrs: 'asd' },
      { tokenID: 1, img: 'https://placeimg.com/400/225/arch', attrs: 'asd' },
      { tokenID: 1, img: 'https://placeimg.com/400/225/arch', attrs: 'asd' },
      { tokenID: 1, img: 'https://placeimg.com/400/225/arch', attrs: 'asd' },
      { tokenID: 1, img: 'https://placeimg.com/400/225/arch', attrs: 'asd' },
      { tokenID: 1, img: 'https://placeimg.com/400/225/arch', attrs: 'asd' },
      { tokenID: 1, img: 'https://placeimg.com/400/225/arch', attrs: 'asd' },
    ];
    return { toast, nfts };
  },
  data() {
    return {
      swiper: undefined,
      tweenedPrice: 10,
      price: 10,
      tokenID: 1,
      isBuying: false,
    };
  },
  methods: {
    onSwiper(swiper) {
      this.swiper = swiper;
    },
    changeCat(event) {
      this.currentCat = this.cats.find(
        (cat) => cat.id === Number(event.target.value),
      );
      this.price = this.currentCat.price;
      this.swiper.slideTo(event.target.value);
    },
  },
  watch: {
    price(n) {
      const dec = Number(n);
      gsap.to(this, {
        duration: 1,
        tweenedPrice: dec || 0,
        modifiers: { tweenedPrice: (tweenedPrice) => tweenedPrice.toFixed(0) },
      });
    },
  },
  components: { Swiper, SwiperSlide },
};
</script>
<template>
  <div class="hero min-h-screen">
    <div class="flex flex-row items-center flex-wrap justify-center">
      <div
        class="card w-96 bg-base-100 shadow-xl m-5"
        v-for="nft in nfts"
        :key="nft.tokenID"
      >
      <figure>
          <img :src="nft.img" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ nft.tokenID }}</h2>
          <p>{{ nft.attrs }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
