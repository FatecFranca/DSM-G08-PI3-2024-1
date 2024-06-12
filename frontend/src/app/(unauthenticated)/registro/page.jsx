'use client'
import { api } from '@/api'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import stylesRegistro from './stylesRegistro.module.css'


export default function RegistrationForm() {
    const [nome, setNome] = useState('')
    const [sobrenome, setSobrenome] = useState('')
    const [cpf, setCpf] = useState('')
    const [dataNascimento, setDataNascimento] = useState('')
    const [genero, setGenero] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmaSenha, setConfirmaSenha] = useState('')
    const [rua, setRua] = useState('')
    const [cidade, setCidade] = useState('')
    const [estado, setEstado] = useState('')
    const [cep, setCep] = useState('')
    const [bairro, setBairro] = useState('')
    const [complemento, setComplemento] = useState('')
    const [numero, setNumero] = useState('')
    const options = ['Feminino', 'Masculino']

    const [isChecked, setIsChecked] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState([])
    const router = useRouter()

    const handleOptionChange = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((item) => item !== option))
        } else {
            setSelectedOptions([...selectedOptions, option])
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post('/users', {
                name: nome,
                lastName: sobrenome,
                gender: 'Undefined',
                password: senha,
                email: email,
                cpf: cpf,
                data_nascimento: dataNascimento,
                address: {
                    cep: cep,
                    street: rua,
                    num: numero,
                    city: cidade,
                    uf: 'SP'
                }
            })

            try {
                
                const loginResponse = await api.post('/auth/login', {
                    email, password: senha
                })

                await localStorage.setItem('token', loginResponse.data.token)
                router.push('/registro2?userId=' + response.data._id)
            } catch (error) {
                router.push('/login')
            }
        } catch (error) {
            console.log('Erro ao enviar dados:', error)
        }

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
                        <h3> Dados Pessoais </h3>
                    </div>


                    <div className={stylesRegistro.nome}>
                        <label htmlFor="nome">Nome:</label>
                        <input
                            type="text"
                            id="nome"
                            placeholder="Jose"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div className={stylesRegistro.sobrenome}>
                        <label htmlFor="nome">Sobrenome:</label>
                        <input
                            type="text"
                            id="Sobrenome"
                            placeholder="Silva"
                            value={sobrenome}
                            onChange={(e) => setSobrenome(e.target.value)}
                            required
                        />
                    </div>

                    <div className={stylesRegistro.cpf}>
                        <label htmlFor="CPF">CPF:</label>
                        <input
                            type="text"
                            id="cpf" placeholder="444.555.666-77"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            required
                        />
                    </div>

                    <div className={stylesRegistro.dataNascimento}>
                        <label htmlFor="nascimento">Data de nascimento:</label>
                        <input
                            type="date"
                            id="nascimento"
                            value={dataNascimento}
                            onChange={(e) => setDataNascimento(e.target.value)}
                            required
                        />
                    </div>


                    <div className={stylesRegistro.checkboxx}>
                        {options.map((option) => (
                            <label key={option}>
                                <input
                                    type="checkbox"
                                    checked={selectedOptions.includes(option)}
                                    onChange={() => handleOptionChange(option)}
                                />
                                {option}
                            </label>
                        ))}
                        <p>Sexo: {selectedOptions.join(', ')}</p>
                    </div>


                    {/*<table className={stylesRegistro.sexo}>
                        <tr>
                            <td>
                                <label htmlFor="sexo">Sexo:</label>
                            </td>
                            
                            <td>
                                    <input type="radio" id="masculino" name="sexo" value="masculino" />
                                    <label htmlFor="masculino">Masculino </label>
                            </td>

                            <td> 
                                <input type="radio" id="feminino" name="sexo" value="feminino" />
                                <label htmlFor="feminino">Feminino</label>
                            </td>

                            <td>
                                <input type="radio" id="feminino" name="sexo" value="feminino" />
                                <label htmlFor="feminino">Não Identificar</label>
                            </td>

                        </tr>
                    </table>*/}



                    <div className={stylesRegistro.email}>
                        <label htmlFor="nascimento">E-mail:</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="mail@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={stylesRegistro.senha}>
                        <label htmlFor="senha">Senha:</label>
                        <input
                            type="password"
                            id="senha"
                            placeholder="Minimo 6 caracteres"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required

                        />
                    </div>


                    <div className={stylesRegistro.confirmaSenha}>
                        <label htmlFor="senha">Confirme a senha:</label>
                        <input
                            type="password"
                            id="confirmaSenha"
                            placeholder="Confirme sua senha"
                            value={confirmaSenha}
                            onChange={(e) => setConfirmaSenha(e.target.value)}
                            required

                        />
                    </div>

                    <div className={stylesRegistro.dadosEndereco}>
                        <h3> Endereço </h3>
                    </div>

                    <div className={stylesRegistro.rua}>
                        <label htmlFor="rua">Rua:</label>
                        <input
                            type="text"
                            id="rua" placeholder="joao Alves Silva"
                            value={rua}
                            onChange={(e) => setRua(e.target.value)}
                            required
                        />
                    </div>

                    <div className={stylesRegistro.numero}>
                        <label htmlFor="numero">Número:</label>
                        <input
                            type="text"
                            id="numero"
                            placeholder="223"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            required
                        />
                    </div>

                    <div className={stylesRegistro.bairro}>
                        <label htmlFor="bairro">Bairro:</label>
                        <input
                            type="text"
                            id="bairro"
                            placeholder="Centro"
                            value={bairro}
                            onChange={(e) => setBairro(e.target.value)}
                            required
                        />
                    </div>

                    <div className={stylesRegistro.cidade}>
                        <label htmlFor="cidade">Cidade:</label>
                        <input
                            type="text"
                            id="cidade"
                            placeholder="Ribeirao Preto"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            required
                        />
                    </div>

                    <div className={stylesRegistro.cep}>
                        <label htmlFor="cep">CEP:</label>
                        <input
                            type="text"
                            id="cep"
                            placeholder="14400-000"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            required
                        />
                    </div>

                    <div className={stylesRegistro.complemento}>
                        <label htmlFor="complemento">Complemento:</label>
                        <input
                            type="text"
                            id="complemento"
                            placeholder="na esquina"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                            required
                        />
                    </div>




                    <div className={stylesRegistro.checkbox}>
                        <input
                            type="checkbox"
                            id="termosDeUso"
                            name="termosDeUso"
                            value="aceito"
                        />
                        <label htmlFor="termosDeUso">Aceito os termos de uso</label>
                    </div>


                    <button type="submit">
                        Avançar
                    </button>
                </form>
            </div>
        </div>
    )
}