function Calculator() {
    function _createCalculator() {
        const calc = document.createElement('div');
        calc.classList.add('calc');
        calc.insertAdjacentHTML("afterbegin", `
        <div class="calc-header">
        <div class="calc-header-buttons">
          <input class="calc-state" type="button" data-hide="true" value="-">
          <input class="calc-state" type="button" data-close="true" value="×">
        </div>
        
        </div>
        <div class="calc-output">
            <div class="calc-output-prev" data-prev="true"></div>
            <div class="calc-output-current" data-cur="true">0</div>
        </div>
        <div class="calc-buttons">
            <button class="calc-button big" data-clear="true">AC</button>
            <button class="calc-button" data-delete="true">DEL</button>
            <button class="calc-button" data-operation="true">÷</button>
            <button class="calc-button" data-number="true">1</button>
            <button class="calc-button" data-number="true">2</button>
            <button class="calc-button" data-number="true">3</button>
            <button class="calc-button" data-operation="true">×</button>
            <button class="calc-button" data-number="true">4</button>
            <button class="calc-button" data-number="true">5</button>
            <button class="calc-button" data-number="true">6</button>
            <button class="calc-button" data-operation="true">+</button>
            <button class="calc-button" data-number="true">7</button>
            <button class="calc-button" data-number="true">8</button>
            <button class="calc-button" data-number="true">9</button>
            <button class="calc-button" data-operation="true">-</button>
            <button class="calc-button" data-number="true">.</button>
            <button class="calc-button" data-number="true">0</button>
            <button class="calc-button big" data-equal="true">=</button>
        </div>
        `)
        document.body.appendChild(calc);
        return calc;
    }

    const $calc = _createCalculator(),
        $calcHeader = $calc.querySelector('.calc-header'),
        $calcPrevOutput = $calc.querySelector('[data-prev]'),
        $calcCurrentOutput = $calc.querySelector('[data-cur]'),
        defaultOutputValue = '0';
        
        calc = {
            open() {
                $calc.classList.add('active');
            },
            close() {
                $calc.classList.remove('active');
            }, 
            collapse() {
                $calc.classList.toggle('collapsed');
            },
            addValue(value) {
                if(value === '.' && $calcCurrentOutput.textContent.includes('.')) return;
                if(value === '.' && $calcCurrentOutput.textContent === defaultOutputValue) {
                    $calcCurrentOutput.textContent += value;
                    return
                }
                if ($calcCurrentOutput.textContent === defaultOutputValue) {
                    return $calcCurrentOutput.textContent = value
                }
                $calcCurrentOutput.textContent += value;
                
            },
            clearValue() {
                $calcPrevOutput.textContent = '';
                $calcCurrentOutput.textContent = defaultOutputValue;
            },
            deleteValue() {
                if ($calcCurrentOutput.textContent === defaultOutputValue) {
                    return
                }
                if ($calcCurrentOutput.textContent.length === 1) {
                    $calcCurrentOutput.textContent = defaultOutputValue;
                    return
                }
                $calcCurrentOutput.textContent = $calcCurrentOutput.textContent.slice(0, -1);
            },

            operation(value) {
                if (value === '-' && $calcCurrentOutput.textContent === defaultOutputValue) {
                    $calcCurrentOutput.textContent = value;
                    return
                }
                if (value === '÷' && $calcCurrentOutput.textContent === defaultOutputValue) {
                    this.clearValue();
                };
            },
            updateDisplay(operator) {
                if ($calcPrevOutput.textContent === '') {
                    $calcPrevOutput.textContent = `${$calcCurrentOutput.textContent} ${operator}`;
                    $calcCurrentOutput.textContent = defaultOutputValue;
                    return
                }
                $calcPrevOutput.textContent += ` ${$calcCurrentOutput.textContent} ${operator}`;
                $calcCurrentOutput.textContent = defaultOutputValue;
            },
            equal() {
                $calcPrevOutput.textContent += ` ${$calcCurrentOutput.textContent}`;
                let currentValues = $calcPrevOutput.textContent.toString().split(' ');
                let filtredValues = currentValues.map(item => {
                    if (item === '÷') {
                        item = '/';
                    }
                    if (item === '×') {
                        item = '*';
                    }
                    return item;
                }).join('');
                let result = eval(filtredValues);
                $calcCurrentOutput.textContent = result;
                $calcPrevOutput.textContent = '';
            }
            
    }
    
    $calc.addEventListener('click', evt => {
        if (evt.target.dataset.close) {
            calc.close();
            return;
        }
        if (evt.target.dataset.hide) {
            calc.collapse();
            return;
        }
        if (evt.target.dataset.number) {
            calc.addValue(evt.target.textContent);
            return;
        }
        if (evt.target.dataset.clear) {
            calc.clearValue();
            return;
        }
        if (evt.target.dataset.delete) {
            calc.deleteValue();
            return;
        }
        if (evt.target.dataset.operation) {
            calc.operation(evt.target.textContent);
            calc.updateDisplay(evt.target.textContent);
            return;
        }
        if (evt.target.dataset.equal) {
            calc.equal();
            return;
        }
     });
    
     $calcHeader.addEventListener("mousedown", e => {        
        e.preventDefault();
        
        let shiftX = e.clientX - $calcHeader.getBoundingClientRect().left;
        let shiftY = e.clientY - $calcHeader.getBoundingClientRect().top;
        moveAt(e.pageX, e.pageY);

        function moveAt(pageX, pageY) {
          $calc.style.left = pageX - shiftX + 'px';
          $calc.style.top = pageY - shiftY + 'px';
        }

        let onMouseMove = function (moveEvt) {
            moveAt(moveEvt.pageX, moveEvt.pageY);
        }
        let onMouseUp = function (upEvt) {
            upEvt.preventDefault();

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

     });

    return calc;
}