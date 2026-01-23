import Layout from '../../components/Layout';
import { COLORS } from '../../constants';
import { useGetLanding } from '../../queries/useGetLanding';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Loading } from '../../components/Loading';
import { HomeContainer, HomeImage, HomeTitle, ImageOverlay } from './styles';

function Home() {
    const { data, isLoading, isError } = useGetLanding();
    // Start with no active image so the first "activation" can animate (fade in).
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isMouseOver, setIsMouseOver] = useState(false);
    const cursorRef = useRef<HTMLDivElement | null>(null);

    const imageUrls = useMemo(() => {
        return (
            data?.images
                ?.map((img) => img.asset?.url)
                .filter((url): url is string => Boolean(url)) ?? []
        );
    }, [data?.images]);

    useEffect(() => {
        if (imageUrls.length === 0) return;
        if (activeIndex !== -1) return;

        // Ensure we paint once with all images at opacity 0, then fade the first in.
        let raf2: number | null = null;
        const raf1 = window.requestAnimationFrame(() => {
            raf2 = window.requestAnimationFrame(() => setActiveIndex(0));
        });

        return () => {
            window.cancelAnimationFrame(raf1);
            if (raf2 != null) window.cancelAnimationFrame(raf2);
        };
    }, [activeIndex, imageUrls.length]);

    useEffect(() => {
        if (imageUrls.length <= 1) return;

        const id = window.setInterval(() => {
            if (isMouseDown) return;
            setActiveIndex((i) => (i + 1) % imageUrls.length);
        }, 5500);

        return () => window.clearInterval(id);
    }, [imageUrls.length, isMouseDown]);

    useEffect(() => {
        if (!isMouseOver) return;
        const cursor = document.createElement('div');
        cursorRef.current = cursor;
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.borderRadius = '50%';
        cursor.style.backgroundColor = COLORS.tertiary;
        cursor.style.position = 'fixed';
        cursor.style.top = '0px';
        cursor.style.left = '0px';
        cursor.style.transform = 'translate(-50%, -50%)';
        cursor.style.pointerEvents = 'none';
        cursor.style.zIndex = '9999';
        cursor.style.transition = 'width 200ms ease, height 200ms ease';
        document.body.appendChild(cursor);

        const onMove = (e: MouseEvent) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        };
        window.addEventListener('mousemove', onMove);

        return () => {
            window.removeEventListener('mousemove', onMove);
            document.body.removeChild(cursor);
            cursorRef.current = null;
        };
    }, [isMouseOver]);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        const sizePx = isMouseDown ? 60 : 20;
        cursor.style.width = `${sizePx}px`;
        cursor.style.height = `${sizePx}px`;
    }, [isMouseDown]);

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <p>Error!</p>;
    }

    return (
        <Layout>
            <HomeContainer
                onMouseDown={() => setIsMouseDown(true)}
                onMouseUp={() => setIsMouseDown(false)}
                onMouseLeave={() => setIsMouseDown(false)}
            >
                <HomeTitle>{data?.title}</HomeTitle>
                {imageUrls.map((url, idx) => (
                    <HomeImage key={url} src={url} alt="Home" $isActive={idx === activeIndex} />
                ))}
                <ImageOverlay onMouseOver={() => setIsMouseOver(true)} onMouseLeave={() => setIsMouseOver(false)} />
            </HomeContainer>
        </Layout>
    );
}

export default Home;


