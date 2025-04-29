// components/sections/UsCarousel.tsx
"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import TeamMemberCard from "@/features/landing/TeamMemberCard";
import Wrapper from "@/components/layout/Wrapper";

const teamData = [
    { id: 1, name: "Сейтмуханова Альмира", role: "Project Manager", imageUrl: "/img/almira.jpg" },
    { id: 2, name: "Нұрланов Эдуард", role: "Frontend Developer", imageUrl: "/img/edu.jpg" },
    { id: 3, name: "Макимова Дильназ", role: "UX&UI Designer", imageUrl: "/img/dilnaz.JPG" }, // Убедитесь что расширение верное
    { id: 4, name: "Жәнібек Дамир", role: "Backend Developer", imageUrl: "/img/damir.jpg" },

];

const UsCarousel = () => {
    return (
        <Wrapper>
            <div className="team-carousel-section py-16 mb-[100px] md:mb-[140px]"> {/* Уменьшил немного mb */}
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 md:mb-16">
                        Біздің команда
                    </h2>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        centeredSlides={false}
                        pagination={{ clickable: true }}
                        navigation={true}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: true,
                        }}
                        className="w-full pb-14"
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                        }}
                    >
                        {teamData.map((member) => (
                            <SwiperSlide key={member.id} className="h-auto pb-1"> {/* Добавим pb-1 на слайд для тени */}
                                <TeamMemberCard
                                    name={member.name}
                                    role={member.role}
                                    imageUrl={member.imageUrl}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            <style jsx global>{`
                .team-carousel-section .swiper-pagination-bullet {
                    background-color: #D1D5DB; /* gray-300 */
                    opacity: 0.8;
                    transition: background-color 0.3s ease, opacity 0.3s ease;
                }

                .team-carousel-section .swiper-pagination-bullet-active {
                    background-color: #7B68EE !important; /* Ваш фиолетовый цвет */
                    opacity: 1;
                }

                .team-carousel-section .swiper-button-prev,
                .team-carousel-section .swiper-button-next {
                    color: #7B68EE !important; /* Ваш фиолетовый цвет */
                    background-color: rgba(255, 255, 255, 0.7); /* Полупрозрачный фон */
                    border-radius: 50%;
                    width: 44px !important; /* Немного увеличим размер */
                    height: 44px !important;
                    transition: background-color 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Легкая тень */
                }

                 /* Уменьшим размер иконки стрелки внутри кнопки */
                 .team-carousel-section .swiper-button-prev::after,
                 .team-carousel-section .swiper-button-next::after {
                    font-size: 18px !important;
                    font-weight: bold;
                 }


                .team-carousel-section .swiper-button-prev:hover,
                .team-carousel-section .swiper-button-next:hover {
                   background-color: rgba(255, 255, 255, 0.9);
                }

                 .team-carousel-section .swiper-slide {
                    height: auto;
                    display: flex;
                 }
                 .team-carousel-section .swiper-slide > div { /* Обращение к дочернему div (карточке) */
                    width: 100%; /* Заставить карточку растянуться */
                 }

            `}</style>
        </Wrapper>
    );
};

export default UsCarousel;