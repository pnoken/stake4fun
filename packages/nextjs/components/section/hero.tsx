export const Hero = () => {
    return (
        <section className="p-12 hero bg-blue-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img src="/rewards.svg" className="md:max-w-xl max-w-xs rounded-lg" />
                <div>
                    <h1 className="text-5xl font-bold">Earn Rewards on your idle crypto assets</h1>
                    <p className="py-6">Earn rewards by just depositing and staking your crypto every week. Our selection process is random and transparent.</p>
                    <a href="/dapp" target="_blank"><button className="btn btn-primary">Launch App</button></a>
                </div>
            </div>
        </section>
    )
}