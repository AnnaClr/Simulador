import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTree, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import "./style.css";

export default function Home() {
    return (
        <main className="home-container">
            <header className="home-header">
                <h1 className="home-title">Simulador Hub Caju Embrapa</h1>
                <p className="home-subtitle">
                    Ferramenta interativa para simulação de custos agrícolas baseada em dados da Embrapa
                </p>
            </header>

            <section className="cards-container">
                <article className="card card-orange">
                    <header className="card-header">
                        <FontAwesomeIcon icon={faTree} className="card-icon" />
                        <h2>Implantação de Pomar</h2>
                    </header>
                    <div className="card-body">
                        <p>
                            Simulação de custos para implantação de pomar de cajueiro-anão no
                            espaçamento 7m x 7m
                        </p>
                    </div>
                    <footer className="card-footer">
                        <Link to="/simulação-implantação-de-pomar" className="card-button">
                            Acessar Simulação
                        </Link>
                    </footer>
                </article>

                <article className="card card-orange-dark">
                    <header className="card-header">
                        <FontAwesomeIcon icon={faExchangeAlt} className="card-icon" />
                        <h2>Substituição de Copa</h2>
                    </header>
                    <div className="card-body">
                        <p>
                            Simulação de custos para substituição de copa de cajueiro no
                            espaçamento 10m x 10m
                        </p>
                    </div>
                    <footer className="card-footer">
                        <Link to="/simulação-substituição-de-copa" className="card-button">
                            Acessar Simulação
                        </Link>
                    </footer>
                </article>
            </section>
        </main>
    );
}