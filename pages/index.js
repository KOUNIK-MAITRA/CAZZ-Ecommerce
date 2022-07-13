import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
const landingPage = () => {



  return (

    <div className='landing-page-wrapper'>


      <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
        <ol className="carousel-indicators">
          <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
          {/* <li data-target="#carouselExampleIndicators" data-slide-to="2"></li> */}
        </ol>
        <div className="carousel-inner">
          <div className="carousel-item p-2  active">
            <Link href="./home">
              <img className="d-block w-100 promotional-banner-img " src="/promotional-banner.png" alt="First slide" />
            </Link>
          </div>
          <div className="carousel-item p-2">
            <Link href="./home">
              <img className="d-block w-100 promotional-banner-img " src="/distorted-chromosomes-promotional-banner.jpg" alt="Second slide" />
            </Link>
          </div>
          {/* <div className="carousel-item p-2">
            <Link href="./home">
              <img className="d-block w-100 promotional-banner-img " src="/promotional-banner.png" alt="Third slide" />
            </Link>
          </div> */}
        </div>
        <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>



      {/* <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
        <ol className="carousel-indicators">
          <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
        </ol>
        <div className="carousel-inner">
          <div className="carousel-item promotional-banner active ">
            <Link href="./home">
              <img className="d-block w-100 promotional-banner-img " src="/promotional-banner.png" alt="First slide" />
            </Link>
          </div>
          <div className="carousel-item promotional-banner">
            <img className="d-block w-100 promotional-banner-img " src="/promotional-banner.png" alt="Second slide" />
          </div>
          <div className="carousel-item promotional-banner">
            <img className="d-block w-100 promotional-banner-img" src="/promotional-banner.png" alt="Third slide" />
          </div>
        </div>

        <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>

        <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>

      </div> */}

      <div className='text-center landingpage-category-titles text-uppercase mx-2'
        style={{ fontWeight: "bolder", backgroundColor: "#545252", color: "white" }}>
        <b>New Releases</b>
      </div>

      <div className='d-flex justify-content-around staticBanner-wrapper py-2 px-1'>
        <div className='img-over-zoom'>
          <Link href="./home" >
            <img src="staticBanner1.png" alt="" className='static-banner-images px-1' />
          </Link>
        </div>
        <div className='img-over-zoom'>
          <Link href="./home" >
            <img src="staticBanner2.png" alt="" className='static-banner-images px-1' />
          </Link>
        </div>
        <div className='img-over-zoom'>
          <Link href="./home" >
            <img src="staticBanner3.png" alt="" className='static-banner-images px-1' />
          </Link>
        </div>
      </div>
      <div className='text-center landingpage-category-titles text-uppercase mx-2' style={{ fontWeight: "bolder", backgroundColor: "#545252", color: "white" }}>
        <b>Exclusive Merchandises</b>
      </div>
      <div className='d-flex justify-content-around staticBanner-wrapper py-2 px-1'>
        <div className='img-over-zoom'>
          <Link href="./home" >
            <img src="merchandiseBanner1.jpg" alt="" className='static-banner-images px-1' />
          </Link>
        </div >
        <div className='img-over-zoom'>
          <Link href="./home" >
            <img src="merchandiseBanner2.jpg" alt="" className='static-banner-images px-1' />
          </Link>
        </div>
        <div className='img-over-zoom'>
          <Link href="./home" >
            <img src="merchandiseBanner3.jpg" alt="" className='static-banner-images px-1' />
          </Link>
        </div>
      </div>
    </div>
    // <div className='landing-page-wrapper'>
    //   <div className="">
    //     <img src="/cazz-banner.png" alt="" className='Cazz-banner-img' />
    //   </div>
    //   <div className="promotional-banner">
    //     <Link href="/home">
    //       <img src="/promotional-banner.png" className=" promotional-banner-img" id="slide" alt="" />
    //     </Link>
    //   </div>
    //   {/* <div className="promotional-banner">
    //     <Link href="/home">
    //       <img src="/cazzxabkp.png" className=" promotional-banner-img" id="slide" alt="" />
    //     </Link>
    //   </div> */}
    // </div>
  )
}

export default landingPage
