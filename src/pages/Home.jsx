import CampaignHero from "../components/CampaignHero";
import CollectionCarousel from "../components/CollectionCarousel";
import PromoDuo from "../components/PromoDuo";
import HandpickedSection from "../components/HandpickedSection";
import JewelleryFeature from "../components/JewelleryFeature";
import AmmaStory from "../components/AmmaStory";
import BestsellersSection from "../components/BestsellersSection";
import GiftDiscovery from "../components/GiftDiscovery";
import CustomOrderSection from "../components/CustomOrderSection";
import CustomerLove from "../components/CustomerLove";


function Home() {
    return (
        <>
            <CampaignHero />
            <CollectionCarousel />
            <PromoDuo />
            <HandpickedSection />
            <JewelleryFeature />
            <AmmaStory />
            <BestsellersSection />
            <GiftDiscovery />
            <CustomOrderSection />
            <CustomerLove />
        </>
    );
}


export default Home;