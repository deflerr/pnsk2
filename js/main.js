new Vue({
    el: '#app',
    data: {
        columns: [
            [], // Первая колонка
            [], // Вторая
            []  // Третья 
        ],
        isFirstColumnLocked: false 
    },
    methods: {
        addCard(columnIndex) {
            if (this.isFirstColumnLocked && columnIndex === 1) {
                alert('Первый столбец заблокирован для редактирования.');
                return;
            }

            const title = prompt('Введите название карточки:');
            if (!title) return;

            const items = [];
            let itemCount = 0;

            while (itemCount < 5) {
                const text = prompt(`Введите пункт ${itemCount + 1} (оставьте пустым для завершения):`);
                if (!text) break;
                items.push({ text, completed: false });
                itemCount++;
            }

            if (items.length >= 3) {
                this.columns[columnIndex - 1].push({
                    id: Math.random().toString(36).substr(2, 9),
                    title,
                    items,
                    completedAt: null
                });
                this.saveData();
            } else {
                alert('Карточка должна содержать от 3 до 5 пунктов.');
            }
        },

        updateProgress(card) {
            const total = card.items.length;
            const completed = card.items.filter(item => item.completed).length;
            const progress = completed / total;

            if (progress > 0.5 && this.columns[0].includes(card)) {
                if (this.columns[1].length >= 5) {
                    this.isFirstColumnLocked = true;
                } else {
                    this.moveCard(card, 1, 0);
                }
            }

            if (progress === 1 && this.columns[1].includes(card)) {
                this.moveCard(card, 2, 1);
                card.completedAt = new Date().toLocaleString();

                
                if (this.columns[1].length < 5) {
                    this.isFirstColumnLocked = false;
                }
            }

            if (progress < 0.5 && this.columns[1].includes(card)) {
                this.moveCard(card, 0, 1);

                if (this.columns[1].length < 5) {
                    this.isFirstColumnLocked = false;
                }
            }

            this.saveData();
        },

        moveCard(card, toColumn, fromColumn) {
            this.columns[fromColumn].splice(this.columns[fromColumn].indexOf(card), 1);
            this.columns[toColumn].push(card);
            this.saveData();
        },

        isColumnBlocked(columnIndex) {
            return columnIndex === 1 && this.columns[1].length >= 5;
        },

        saveData() {
            try {
                const dataToSave = {
                    columns: this.columns,
                    isFirstColumnLocked: this.isFirstColumnLocked
                };
                localStorage.setItem('notesAppData', JSON.stringify(dataToSave));
            } catch (error) {
                console.error('Ошибка при сохранении данных:', error);
            }
        },

        loadData() {
            try {
                const data = localStorage.getItem('notesAppData');
                if (data) {
                    const parsedData = JSON.parse(data);
                    this.columns = parsedData.columns;
                    this.isFirstColumnLocked = parsedData.isFirstColumnLocked;
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                this.columns = [[], [], []]; 
                this.isFirstColumnLocked = false;
            }
        }
    },

    mounted() {
        this.loadData();
    }
});
