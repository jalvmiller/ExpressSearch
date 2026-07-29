// Componente principal
// Onde ficam as variáveis e a lógica
// como exemplo, a função que chama a API do backend
// quando o usuário digita uma palavra-chave
// e aperta enter
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Decorator, no ts eles servem pra injetar metadados na classe,
// ele diz ao angular que a classe App é um componente visual
@Component({

  // Define a tag HTML que representa o componenete
  // aparece em algum lugar do HTML
  selector: 'app-root',

  // Declaração de o quê o componente precisa importar
  // como a intenção é criar um componente independente
  // ele precisa passar o FormsModule para que o angualr
  // entenda que diretiva ngModel está sendo usada em 
  // algum lugar do HTML
  imports: [FormsModule],

  // Aponta para arquivos físicos que contém a estrutura
  // HTML e o estilo CSS do componente
  templateUrl: './app.html',

  styleUrl: './app.css'
})

export class App {
  // Injeta o serviço HttpClient para fazer requisições Ajax
  private http = inject(HttpClient);

  // Signals (Sinais): O padrão reativo do Angular para gerenciar estado
  // é um modelo de reatividade, quando ele é alterado usando o .set(),
  // o Angular sabe exatamente em qual parte o valor é exibido e atualiza
  // só aquilo de uma forma rápida

  // A sintaxe signal('') cria uma variável reativa; 
  // signal<any[]>([]), o any[] é um tipo genérico do ts, ele avisa o
  // compilador que esse sinal vai gerenciar um array com objetos genericos
  // é inicializado com um array vazio "([])" 
  termo = signal('');
  resultados = signal<any[]>([]);
  carregando = signal(false);
  erro = signal('');

  // Método de busca
  buscar(event?: Event) {
    if (event) {
      event.preventDefault(); // Impede o envio clássico do formulário HTML (recarregar página)
    }

    const valorBusca = this.termo().trim();
    if (!valorBusca) {
      this.resultados.set([]);
      return;
    }

    // O signal é chamado como se fosse uma função,
    // o método set é responsável por alterar o valor
    this.carregando.set(true);
    this.erro.set('');
    //--------------------------------------------------------------------------------
    // Realiza o GET na API REST do backend
    // React/Vite usam fetch ou Axios com base em promises, o Angular usa o Observables,
    // o Observables vem da biblioteca RxJS (Reactive Extensions for JavaScript)
    // é um "fluxo de dados no tempo"
    // Ele monitora a resposta da requisição, quando é usado o método .subscribe() nela

    // A estrutura da resposta do corpo da resposta JSON é array com documentos do tipo
    // genérico any[] 
    this.http.get<any[]>(`http://localhost:3001/api/websites?q=${encodeURIComponent(valorBusca)}`)
      // o encodeURIComponent() serve para garantir que os caracteres especiais na URL sejam codificados
      // Exemplo: Se o valorBusca for "busca avançada", ele será codificado como "busca%20avançada"
      .subscribe({
        next: (dados) => {
          // next é chamada quando a API do backend responde com sucesso (200 OK)
          // Dados enviados pelo Express são jogados dentro do sinal e a animação de carregar termina
          this.resultados.set(dados);
          this.carregando.set(false);
        },
        error: (err) => {
          // error é chamada quando a API do backend responde com um erro (4xx ou 5xx)
          console.error('Erro de conexão:', err);
          this.erro.set('Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 3001.');
          this.carregando.set(false);
        }
      });
  }
}
