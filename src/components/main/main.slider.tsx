"use client"
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React from "react";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box, Button, Divider } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Link from "next/link";
import { convertSlugUrl } from "@/utils/api";
import Image from 'next/image';


interface IProps {
    data: ITrackTop[],
    tittle: string
}

export default function MainSlider(props: IProps) {
    let { data, tittle } = props;

    const NextArrow = (props: any) => {
        return (
            <Button color="inherit" variant="contained"
                onClick={props.onClick}
                sx={{
                    position: "absolute",
                    right: 25,
                    top: '25%',
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronRightIcon />
            </Button>
        )
    }

    const PrevArrow = (props: any) => {
        return (
            <Button color="inherit" variant="contained"
                onClick={props.onClick}
                sx={{
                    position: "absolute",
                    // left: "-10%",
                    top: '25%',
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronLeftIcon />
            </Button>
        )
    }

    var settings: Settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <>
            <Box
                sx={{
                    margin: '0 50px',
                    '.track': {
                        padding: '0 10px',
                        'img': {
                            height: '150px', width: '150px'
                        }

                    },
                    'h3': {
                        border: '1px solid #ccc',
                        padding: '20px',
                        height: '200px',
                    }
                }}
            >
                <h2>{tittle}</h2>
                <Slider {...settings}>
                    {data.map((item) => (
                        <div className="track" key={item._id}>
                            <div style={{
                                position: "relative",
                                width: '160px',
                                height: '160px',
                            }}>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
                                    alt="image slider"
                                    fill
                                    sizes="1"
                                />
                            </div>

                            <Link href={`/track/${convertSlugUrl(item.title)}-${item._id}.html?audio=${item.trackUrl}`}>
                                <h4>{item.title}</h4>
                            </Link>
                            <h5>{item.description}</h5>
                        </div>
                    ))}

                </Slider>
                <Divider />
            </Box>

        </>
    );
}