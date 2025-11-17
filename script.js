        document.addEventListener('DOMContentLoaded', function() {
            // 1. スムーズスクロールの実装 (ユーザビリティ向上)
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
        
                    const targetId = this.getAttribute('href');
        
                    // 【修正点】targetIdが「#」単体でないこと、かつtargetIdが「#」で始まっている場合にのみ実行
                    if (targetId === '#') {
                        // href="#" の場合は、preventDefaultのみ実行してスムーズスクロール処理をスキップ
                        e.preventDefault();
                        return;
                    }

                    // #heroなどのリンクでデフォルトのアンカー動作をキャンセル
                    if (targetId.length > 1) { // href="#" を除外するため、'#'より長いことを確認
                             e.preventDefault();
                    }
        
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        // ヘッダーの高さを考慮してスクロール位置を調整
                        const headerHeight = document.querySelector('header').offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });


            // 2. スクロール時のフェードインアニメーション (視覚的ユーザビリティ向上)
            const faders = document.querySelectorAll('.fade-in-item');

            const appearOptions = {
                threshold: 0.2, // 要素が20%見えたら発火
                rootMargin: "0px 0px -50px 0px" // ビューポートの下端から50px手前で発火
            };

            const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return; // 見えていなければ何もしない
                    }
                    // 見えたら 'visible' クラスを付与
                    entry.target.classList.add('visible');
                    // 一度表示されたら監視を停止
                    appearOnScroll.unobserve(entry.target);
                });
            }, appearOptions);

            faders.forEach(fader => {
                appearOnScroll.observe(fader);
            });

/* 3. カート画面の動的生成と表示/非表示ロジック (ユーザビリティ向上) */

// カート画面のHTMLテンプレートリテラル。引数 product から商品情報を動的に埋め込む
const cartTemplate = (product) => `
    <div class="cart-overlay is-active">
        <div class="cart-container">
            <div class="checkout-steps">
                <div class="step active">入力</div>
                <div class="step">確認</div>
                <div class="step">完了</div>
            </div>

            <div class="cart-content-wrapper">
                
                <div class="cart-summary-area">
                    <a href="#" class="back-to-shop back-btn-top">ショップに戻る</a>
                    <h2 style="margin-top: 15px; font-size: 1.2em; border-bottom: none;">カートに入っている商品</h2>
                    <div class="cart-item-list">
                        <div class="cart-item">
                            <img src="${product.id === 'coffee' ? 'image/salweenCoffee.jpg' : 'image/salweenpatis.jpg'}" alt="${product.name}" />
                            <div class="item-details">
                                <div class="item-name">${product.name}</div>
                                <div class="item-name" style="color: #666; font-weight: normal; font-size: 0.8em;">(11/30頃発送予定)</div>
                                <div class="item-price">
                                    <span class="product-price">¥${product.price.toLocaleString()}</span>
                                    <select class="curt-quantity" style="padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 0.9em;">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                            </div>
                            <button class="remove-item-btn" style="background: none; border: none; font-size: 1.2em; color: #aaa; cursor: pointer;">×</button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <div style="display: flex; gap: 0px;">
                            <input type="text" placeholder="クーポンコード" class="input-field" style="flex-grow: 1; border-radius: 6px 0px 0px 6px;border-right: 0;" />
                            <button style="background-color: #eee; border: 1px solid #ccc; border-radius: 0px 6px 6px 0px; cursor: pointer; width: 70px;">適用</button>
                        </div>
                    </div>

                    <div class="cart-totals">
                        <span>小計</span>
                        <span class="cart-totalsSubtotal">¥${product.price.toLocaleString()}</span>
                    </div>
                    <div class="item-price" style="border-top: none;">
                        <span>送料</span>
                        <span>送料別</span>
                    </div>
                    <div class="cart-totals" style="font-size: 1.3em;">
                        <span>合計</span>
                        <span class="cart-totalsTotal">¥${product.price.toLocaleString()}</span>
                    </div>
                </div>

                <div class="cart-form-area">
                    
                    <div class="form-section">
                        <h2>メールアドレス</h2>
                        <div class="form-group">
                            <input type="email" placeholder="メールアドレス" class="input-field" />
                            <p style="font-size: 0.8em; color: #666; text-align: right; margin-top: 5px;">例) sample@example.com</p>
                        </div>
                        <div style="display: flex; align-items: center; font-size: 0.9em; margin-bottom: 30px;">
                            <input class="input-labelCheckbox" type="checkbox" id="shop-info" checked />
                            <label for="shop-info">ショップの情報を受け取る</label>
                        </div>
                    </div>

                    <form class="h-adr form-section">
                        <input type="hidden" class="p-country-name" value="Japan">
                        <h2>お届け先情報</h2>
                        <div class="input-group">
                            <input type="text" placeholder="お名前 (姓)" class="input-field" />
                            <input type="text" placeholder="お名前 (名)" class="input-field" />
                        </div>
                        <p style="font-size: 0.8em; color: #666; text-align: right; margin-top: 5px;">例) 鈴木 太郎</p>
                        
                        <div class="form-group">
                            <input type="text" placeholder="郵便番号" maxlength="7" class="p-postal-code input-field" id="Postalcode" />
                            <p style="font-size: 0.8em; color: #666; text-align: right; margin-top: 5px;">例) 1066237</p>
                        </div>
                        
                        <div class="form-group">
                            <select class="p-region input-field" id="Prefecture">
                                <option value="">都道府県を選択してください</option>
                                <option value="北海道">北海道</option>
                                <option value="青森県">青森県</option>
                                <option value="岩手県">岩手県</option>
                                <option value="宮城県">宮城県</option>
                                <option value="秋田県">秋田県</option>
                                <option value="山形県">山形県</option>
                                <option value="福島県">福島県</option>
                                <option value="茨城県">茨城県</option>
                                <option value="栃木県">栃木県</option>
                                <option value="群馬県">群馬県</option>
                                <option value="埼玉県">埼玉県</option>
                                <option value="千葉県">千葉県</option>
                                <option value="東京都">東京都</option>
                                <option value="神奈川県">神奈川県</option>
                                <option value="新潟県">新潟県</option>
                                <option value="富山県">富山県</option>
                                <option value="石川県">石川県</option>
                                <option value="福井県">福井県</option>
                                <option value="山梨県">山梨県</option>
                                <option value="長野県">長野県</option>
                                <option value="岐阜県">岐阜県</option>
                                <option value="静岡県">静岡県</option>
                                <option value="愛知県">愛知県</option>
                                <option value="三重県">三重県</option>
                                <option value="滋賀県">滋賀県</option>
                                <option value="京都府">京都府</option>
                                <option value="大阪府">大阪府</option>
                                <option value="兵庫県">兵庫県</option>
                                <option value="奈良県">奈良県</option>
                                <option value="和歌山県">和歌山県</option>
                                <option value="鳥取県">鳥取県</option>
                                <option value="島根県">島根県</option>
                                <option value="岡山県">岡山県</option>
                                <option value="広島県">広島県</option>
                                <option value="山口県">山口県</option>
                                <option value="徳島県">徳島県</option>
                                <option value="香川県">香川県</option>
                                <option value="愛媛県">愛媛県</option>
                                <option value="高知県">高知県</option>
                                <option value="福岡県">福岡県</option>
                                <option value="佐賀県">佐賀県</option>
                                <option value="長崎県">長崎県</option>
                                <option value="熊本県">熊本県</option>
                                <option value="大分県">大分県</option>
                                <option value="宮崎県">宮崎県</option>
                                <option value="鹿児島県">鹿児島県</option>
                                <option value="沖縄県">沖縄県</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <input type="text" placeholder="市区町村" class="p-locality p-street-address input-field" id="Municipality" />
                            <p style="font-size: 0.8em; color: #666; text-align: right; margin-top: 5px;">例) 千代田区九段下</p>
                        </div>

                        <div class="form-group">
                            <input type="text" placeholder="番地・建物名・部屋番号" class="input-field" id="BlockNumber" />
                            <p style="font-size: 0.8em; color: #666; text-align: right; margin-top: 5px;">例) 1丁目1-1 グランド九段下501号室</p>
                        </div>
                        
                        <div class="form-group">
                            <input type="tel" placeholder="電話番号" class="input-field" />
                            <p style="font-size: 0.8em; color: #666; text-align: right; margin-top: 5px;">例) 09012345678</p>
                        </div>
                    </form>

                    <div class="form-section">
                        <h2>購入者情報</h2>
                        <p style="font-size: 0.9em; margin-bottom: 15px;">お届け先情報と購入者情報が異なる場合、入力してください。</p>
                        <label class="input-field" style="text-align: left; background: var(--color-white); cursor: pointer;">
                            <input class="input-labelCheckbox" type="checkbox"> お届け先情報と購入者情報が異なるので、入力する
                        </label>
                    </div>

                    <div class="form-section">
                        <h2>配送方法</h2>
                        <div class="delivery-message">
                        <p style="color: var(--color-accent); font-size: 0.9em;">
                            ※ お届け先が入力されていないため、配送方法を選択できません。お届け先住所を入力してください。
                        </p>
                       </div>
                    </div>

                    <div class="form-section">
                        <h2>お支払い方法</h2>
                        <label class="payment-option">
                            <input type="radio" name="payment" value="bank" checked /> 
                            銀行振り込み
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="payment" value="convenience" /> 
                            コンビニ決済またはPay-easy
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="payment" value="paypal" /> 
                            PayPal（クレジットカード/銀行口座）
                        </label>
                        <p style="text-align: center; font-size: 0.8em; color: #666; margin-top: 10px;">
                            <span>●</span> このショップでのお買い物が安心な理由
                        </p>
                    </div>

                    <div class="form-section">
                        <h2>備考欄</h2>
                        <textarea class="input-field" rows="5" placeholder="ご要望などがありましたら入力してください。"></textarea>
                    </div>

                    <button class="cart-cta-button next-step-btn" type="button">
                        入力内容の確認へ
                    </button>
                    
                    <a href="#" class="back-to-shop back-btn-bottom">
                        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 5px;">
                            <path d="M15 18L9 12L15 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        ショップに戻る
                    </a>
                </div>
            </div>

            <div style="text-align: center; margin-top: 30px; font-size: 0.8em; color: #666;">
                <a href="#" style="color: #666; margin-right: 10px;">プライバシーポリシー</a>
                <a href="#" style="color: #666;">特定商取引法についての表記</a>
            </div>
            
        </div>
    </div>
`;


// 4. カート内の数量変更イベントリスナー (金額再計算)
function updateCartTotals() {
    // 動的生成された要素を確実に取得
    const cartItem = document.querySelector('.cart-item');
    if (!cartItem) return;

    const quantitySelect = cartItem.querySelector('.curt-quantity');
    const subtotalElement = document.querySelector('.cart-totalsSubtotal');
    const totalElement = document.querySelector('.cart-totalsTotal');
    const cartOverlay = document.querySelector('.cart-overlay');
    
    // cartOverlayから単価を取得 (修正箇所で追加した属性から取得)
    const basePriceAttr = cartOverlay ? cartOverlay.getAttribute('data-base-price') : null;
    if (!quantitySelect || !subtotalElement || !totalElement || !basePriceAttr) return;

    const quantity = parseInt(quantitySelect.value, 10);
    const basePrice = parseInt(basePriceAttr, 10); // 数値として使用

    if (isNaN(quantity) || isNaN(basePrice)) return;

    const newSubtotal = basePrice * quantity;
    const newTotal = newSubtotal; // 現状、送料は固定（または未定）として小計＝合計とする

    // 金額表示の更新 (toLocaleStringでカンマ区切り)
    subtotalElement.textContent = `¥${newSubtotal.toLocaleString()}`;
    totalElement.textContent = `¥${newTotal.toLocaleString()}`;
}

// **配送方法のラジオボタンDOMテンプレートを追加**
const deliveryOptionsTemplate = () => `
    <div class="form-section">
        <div class="form-group">
            <label class="payment-option">
                <input type="radio" name="deliveryMethod" value="standard" checked style="margin-right: 15px; transform: scale(1.5);">
                <div style="flex-grow: 1;">普通郵便</div>
                <div>¥0</div>
            </label>
            </div>
    </div>
`;

const openCartButtons = document.querySelectorAll('.open-cart-btn');

openCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault(); // デフォルトのリンク動作をキャンセル

        // 商品情報の取得
        const productId = this.getAttribute('data-product-id');
        const productName = this.getAttribute('data-product-name');
        // 価格を数値として取得し、toLocaleStringのためにStringで保持
        const price = parseInt(this.getAttribute('data-price'), 10);
        
        const product = {
            id: productId,
            name: productName,
            price: price
        };

        // 既存のカート画面があれば削除 (多重起動防止)
        const existingOverlay = document.querySelector('.cart-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // カート画面を body の末尾に挿入して表示
        document.body.insertAdjacentHTML('beforeend', cartTemplate(product));
        
        // ユーザビリティ向上: 背後のスクロールを禁止し、新しい画面を最上部へ
        const cartOverlay = document.querySelector('.cart-overlay.is-active');
        if (cartOverlay) {
            // **【修正箇所】数量変更時の計算のために単価をカスタムデータ属性として保存**
            cartOverlay.setAttribute('data-base-price', product.price);

            //  YubinBango.jsの処理を再実行する
            // フォームが動的に追加されたため、YubinBangoの機能を再起動する。
            // 該当フォーム(h-adrを持つ)を起点に検索し、初期化を行う。
            const addressForm = cartOverlay.querySelector('.h-adr');
            if (addressForm) {
                new YubinBango.MicroformatDom(addressForm);
            }
                
            cartOverlay.scrollTop = 0;
            document.body.style.overflow = 'hidden';

            // **【追加箇所】数量変更イベントリスナーを設定 (動的生成された要素のため)**
            const quantitySelect = cartOverlay.querySelector('.curt-quantity');
            if (quantitySelect) {
                quantitySelect.addEventListener('change', updateCartTotals);
            }
            // **【追加箇所】お届け先情報入力完了を監視し、配送方法を表示するロジック**
            const addressInputs = cartOverlay.querySelectorAll('.h-adr .input-field');
            const deliveryMessage = cartOverlay.querySelector('.delivery-message');

            // 住所入力が全て完了しているかチェックする関数
            function checkAddressCompletion() {
                let allFilled = true;
                addressInputs.forEach(input => {
                    // select-one の場合はデフォルト値以外が選択されているか
                    if (input.tagName === 'SELECT' && input.value === '') {
                        allFilled = false;
                    }
                    // text, tel, email の場合は値が入っているか
                    else if (input.tagName === 'INPUT' && input.value.trim() === '') {
                        allFilled = false;
                    }
                });

                if (allFilled) {
                    // 全て入力されていたら、配送方法のDOMに書き換え
                    if (deliveryMessage.querySelector('p')) {
                        deliveryMessage.innerHTML = deliveryOptionsTemplate();
                    }
                } else {
                    // 1つでも空欄になった場合、初期メッセージに戻す
                    // ただし、既にラジオボタンが表示されている場合のみ元に戻す
                    if (!deliveryMessage.querySelector('p')) {
                         deliveryMessage.innerHTML = `
                            <p style="color: var(--color-accent); font-size: 0.9em;">
                            ※ お届け先が入力されていないため、配送方法を選択できません。お届け先住所を入力してください。
                            </p>
                         `;
                    }
                }
            }

            // 全ての入力欄にイベントリスナーを設定
            addressInputs.forEach(input => {
                input.addEventListener('input', checkAddressCompletion);
                input.addEventListener('change', checkAddressCompletion); // select用
            });

            // 最初に一度チェックを実行（YubinBangoで自動入力された場合に対応）
            checkAddressCompletion();
        }


        // 「ショップに戻る」ボタンのイベントリスナー設定 (動的生成された要素のため)
        document.querySelectorAll('.back-to-shop').forEach(backBtn => {
            backBtn.addEventListener('click', function(event) {
                event.preventDefault();
                const overlay = document.querySelector('.cart-overlay.is-active');
                if (overlay) {
                    overlay.remove(); // カート画面をDOMから削除
                    document.body.style.overflow = ''; // スクロール禁止を解除
                }
            });
        });

        // ユーザビリティ向上: 最初の入力欄 (メールアドレス) にフォーカス
        setTimeout(() => {
            const emailInput = document.querySelector('.cart-form-area input[type="email"]');
            if(emailInput) {
                emailInput.focus();
            }
        }, 100);
    });
});
});
