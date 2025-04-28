// components/sections/UsCarousel.tsx
"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Убираем EffectCoverflow, используем стандартные
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Импорты стилей Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Путь к вашей карточке
import TeamMemberCard from "@/features/landing/TeamMemberCard";
// Путь к вашему Wrapper
import Wrapper from "@/components/layout/Wrapper";

// Данные команды
const teamData = [
    { id: 1, name: "Сейтмуханова Альмира", role: "Project Manager", imageUrl: "/img/almira.jpg" },
    { id: 2, name: "Нұрланов Эдуард", role: "Frontend Developer", imageUrl: "/img/edu.jpg" },
    { id: 3, name: "Макимова Дильназ", role: "UX&UI Designer", imageUrl: "/img/dilnaz.JPG" }, // Убедитесь что расширение верное
    { id: 4, name: "Жәнібек Дамир", role: "Backend Developer", imageUrl: "/img/damir.jpg" },

];

const UsCarousel = () => {
    return (
        <Wrapper>
            {/* Обертка для секции и стилизации Swiper */}
            <div className="team-carousel-section py-16 mb-[100px] md:mb-[140px]"> {/* Уменьшил немного mb */}
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 md:mb-16">
                        Біздің команда
                    </h2>

                    <Swiper
                        // Подключаем модули
                        modules={[Navigation, Pagination, Autoplay]}
                        // Убираем effect, по умолчанию будет 'slide'
                        spaceBetween={30} // Расстояние между слайдами
                        slidesPerView={1} // По одному слайду по умолчанию (на мобильных)
                        loop={true}
                        centeredSlides={false} // Обычно false для 'slide' с несколькими slidesPerView
                        pagination={{ clickable: true }}
                        navigation={true}
                        autoplay={{
                            delay: 5000, // Немного увеличим задержку
                            disableOnInteraction: true, // Отключать при взаимодействии - часто лучше для UX
                        }}
                        className="w-full pb-14" // Добавим больше места снизу для пагинации
                        // Брейкпоинты для адаптивности
                        breakpoints={{
                            // Когда ширина экрана >= 640px
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            // Когда ширина экрана >= 1024px
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                        }}
                    >
                        {teamData.map((member) => (
                            // Убираем фиксированную ширину, slidesPerView управляет этим
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
            {/* Глобальные стили или стили в <style jsx> для Swiper */}
            {/* Рекомендуется вынести в отдельный CSS файл */}
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

                /* Позиционирование стрелок (можно настроить) */
                /* .team-carousel-section .swiper-button-prev { left: 5px; }
                .team-carousel-section .swiper-button-next { right: 5px; } */

                 /* Стили для слайдов, чтобы карточки занимали всю высоту */
                 .team-carousel-section .swiper-slide {
                    height: auto; /* Позволяет слайду подстраиваться под контент */
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