export default function BrewingVideo({videoUrl, posterUrl, title}) {
    return (
        <section className="brew-section">
            <div className="brew-section__heading">
                <span className="brew-eyebrow">Watch and Learn</span>
                <h2>{title}</h2>
                <p>Follow the complete process before trying it yourself.</p>
            </div>

            {videoUrl 
                ? <video 
                    className="brew-main-video" 
                    controls 
                    preload="metadata" 
                    poster={posterUrl || undefined}>
                        <source src={videoUrl} />
                        Your browser doesn't support HTML Videos.
                    </video>
                : <div 
                    className="brew-video-placeholder"
                    style={{ backgroundImage: `linear-gradient(90deg,rgba(24,27,22,.8),rgba(24,27,22,.15)),url("${posterUrl || ""}")` }}>
                        <div>
                            <span className="brew-eyebrow">Coming soon</span>
                            <h3>Our brewing tutorial is in the works.</h3>
                            <p>We are preparing a step-by-step video for this brewing method.</p>
                        </div>
                    </div>}
        </section>
    )
}