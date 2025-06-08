import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ShareModule } from '../shared/share-module';
import { ChatbotService } from '../service/chat-bot.service';

@Component({
  selector: 'app-chat-bot',
  imports: [ShareModule],
  standalone: true,
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.scss'
})
export class ChatBotComponent implements OnInit {

  @Input() meetingId: string | null = '';

  inputChatbot: string = '';
  chatAi: any[] = [];
  isTyping: boolean = false;

  constructor(
    private service: ChatbotService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    console.log('meetingId', this.meetingId);
  }

  // Hàm decode Unicode escape, xử lý được surrogate pair (emoji)
  decodeUnicodeEscapes(str: string): string {
    try {
      // JSON.parse sẽ biến chuỗi unicode escape thành ký tự thật
      return JSON.parse(`"${str.replace(/"/g, '\\"')}"`);
    } catch (e) {
      return str;
    }
  }

  onAskChatbot() {
    this.chatAi.push({
      role: 'User',
      content: this.inputChatbot,
    });

    let aiMessage = {
      role: 'DeepSeek',
      content: ''
    };
    this.chatAi.push(aiMessage);

    this.service.sendMessage(this.inputChatbot).subscribe({
      next: (chunk: string) => {
        // Giải mã unicode escape thành ký tự thật (emoji)
        const decoded = this.decodeUnicodeEscapes(chunk);

        // Xử lý loại bỏ ký tự không mong muốn nếu cần
        const formattedText = decoded
          .replaceAll('"', '')
          .replaceAll('[', '')
          .replaceAll(']', '')
          .replaceAll(',', '')
          .replace(/\\n/g, '<br>');

        aiMessage.content += formattedText;
      },
      error: (err: any) => {
        console.error('API error:', err);
      }
    });

    this.inputChatbot = '';
  }

}
