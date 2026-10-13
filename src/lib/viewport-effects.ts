// Một chỗ theo dõi vị trí cuộn cho cả trang (thay cho mỗi khối một IntersectionObserver + một state React):
//  - [data-reveal]          → lần đầu lọt vào màn thì gắn data-reveal-state="in" (CSS cho hiện dần), rồi thôi theo dõi.
//  - [data-pause-offscreen] → bật/tắt data-offscreen; CSS dừng MỌI animation lặp bên trong khi khối khuất màn.
//    Lý do: Chrome vẫn tính lại animation đang chạy ở mọi khung hình dù phần tử đã khuất — chỉ PAUSE mới hết tốn
//    (đo ở growx-fe 13/10: đổi cách viết keyframe không đỡ, chỉ dừng mới đỡ).
// Node mới (đổi trang phía client) được MutationObserver bắt. Trạng thái nằm trên thuộc tính DOM,
// React không quản → render lại không làm khối đã hiện bị ẩn lại.

const REVEAL_SELECTOR = "[data-reveal]";
const PAUSE_SELECTOR = "[data-pause-offscreen]";
const REVEAL_ROOT_MARGIN = "0px 0px -10% 0px";
// Bật animation trước khi khối vào màn một chút để không thấy nó "giật chạy" ở mép.
const PAUSE_ROOT_MARGIN = "120px 0px";

function forEachMatch(node: Node, selector: string, fn: (el: Element) => void) {
  if (!(node instanceof Element)) return;
  if (node.matches(selector)) fn(node);
  node.querySelectorAll(selector).forEach(fn);
}

/** Bắt đầu theo dõi; trả hàm dọn dẹp. */
export function startViewportEffects(root: Document = document): () => void {
  const reveal = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-reveal-state", "in");
        reveal.unobserve(entry.target);
      }
    },
    { rootMargin: REVEAL_ROOT_MARGIN },
  );

  const pause = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting);
    },
    { rootMargin: PAUSE_ROOT_MARGIN },
  );

  const watch = (node: Node) => {
    forEachMatch(node, REVEAL_SELECTOR, (el) => {
      if (el.getAttribute("data-reveal-state") !== "in") reveal.observe(el);
    });
    forEachMatch(node, PAUSE_SELECTOR, (el) => pause.observe(el));
  };

  watch(root.body);
  const mutations = new MutationObserver((records) => {
    for (const record of records) record.addedNodes.forEach(watch);
  });
  mutations.observe(root.body, { childList: true, subtree: true });

  return () => {
    mutations.disconnect();
    reveal.disconnect();
    pause.disconnect();
  };
}
