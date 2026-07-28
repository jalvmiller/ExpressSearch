import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Componente principal
// Onde ficam as variáveis e a lógica
// como exemplo, a função que chama a API do backend
// quando o usuário digita uma palavra-chave
// e aperta enter

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
