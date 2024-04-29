'use client'
import { LinkButton } from "@/components/LinkButton"
import { Container } from "../styles"
import { Button } from "@/components/Button"
import { useRouter } from "next/navigation"
import stylesRegistro from './stylesRegistro2.module.css'
import { useState } from 'react'
import Image from 'next/image'



export default function RegistrationForm2() {
    const [cardiorespiratoria, setCardiorespiratoria] = useState('');
    const [cirurgia, setCirurgia] = useState('');
    const [historico, setHistorico] = useState('');
    const [medicamentos, setMedicamentos] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        //
        console.log('Dados enviados:');
        console.log('Possui alguma doença cardiorespiratoria:', cardiorespiratoria);
        console.log('Alguma cirurgia anterior:', cirurgia);
        console.log('Histórico de alergias a medicamentos ou alimentos:', historico);
        console.log('Medicamentos atualmente em uso', medicamentos);

        setCardiorespiratoria('');
        setCirurgia('');
        setHistorico('');
        setMedicamentos('');
    }

        return (
            <div className={stylesRegistro.container}>
                 <div className={stylesRegistro.imageContainer}>
                  <Image
                          src="/images/CABEÇALHO.png"
                          alt=""
                          width={192}
                          height={40}
                        />
                </div>
                <div className={stylesRegistro.formulariocadastro}>
                        <form className={stylesRegistro.formRegistro} onSubmit={handleSubmit}>
                           
                            <div className={stylesRegistro.dadosPessoais}>
                                <h3> Dados Medicos </h3>
                            </div>
                            
        
                            <div className={stylesRegistro.cardiorespiratorio}>
                                <label htmlFor="nome">Possui alguma doença cardiorespiratoria ?</label>
                                <input
                                type="text"
                                id="nome"
                                placeholder="Se sim, qual ?"
                                value={cardiorespiratoria}
                                onChange={(e) => setCardiorespiratoria(e.target.value)}
                                required
                                />
                            </div>
        
                            <div className={stylesRegistro.cirurgia}>
                                <label htmlFor="nome">Alguma cirurgia anterior ?</label>
                                <input
                                type="text"
                                id="Sobrenome"
                                placeholder="Se sim, qual ?"
                                value={cirurgia}
                                onChange={(e) => setCirurgia(e.target.value)}
                                required
                                />
                            </div>
        
                            <div className={stylesRegistro.historico}>
                                <label htmlFor="CPF">Histórico de alergias a medicamentos ou alimentos ?</label>
                                <input
                                type="text"
                                id="cpf"placeholder="Se sim, qual ?"
                                value={historico}
                                onChange={(e) => setHistorico(e.target.value)}
                                required
                                />
                            </div>

                            <div className={stylesRegistro.medicamentos}>
                                <label htmlFor="CPF">Medicamentos atualmente em uso ?</label>
                                <input
                                type="text"
                                id="cpf"placeholder="Se sim, qual ?"
                                value={medicamentos}
                                onChange={(e) => setMedicamentos(e.target.value)}
                                required
                                />
                            </div>

                           {/* <div className={stylesRegistro.checkbox}>
                                <input 
                                    type="checkbox" 
                                    id="termosDeUso" 
                                    name="termosDeUso" 
                                    value="aceito" 
                                />
                                <label htmlFor="termosDeUso">Aceito os termos de uso</label>
                                </div> */}
                            <button type="submit">Cadastrar</button>
                        </form>
                </div>
            </div>
        );
}