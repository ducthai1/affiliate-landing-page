import { CHANNELS } from "@/features/channels";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChannelCard } from "./ChannelCard";

export function ChannelsSection() {
  return (
    <section id="kenh" aria-labelledby="kenh-title" className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="kenh-title"
          eyebrow="Các kênh của chúng tôi"
          title={
            <>
              Mỗi góc nhà, <span className="text-gradient">một kênh riêng</span>
            </>
          }
          description="Theo dõi kênh hợp với bạn nhất — hoặc nhắn tin trực tiếp cho page nếu cần hỏi gì."
        />
        <ul className="grid gap-6 md:grid-cols-2">
          {CHANNELS.map((c, i) => (
            // min-w-0: ô lưới mặc định không co nhỏ hơn nội dung → tên kênh dài đẩy cả trang tràn ngang trên điện thoại.
            <li key={c.key} className="min-w-0">
              <Reveal delay={i * 90} className="h-full">
                <ChannelCard channel={c} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
