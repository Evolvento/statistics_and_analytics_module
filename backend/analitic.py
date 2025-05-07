import pandas as pd
import ast


class ModuleAnalitics():
    def __init__(self, selected_supplier = ['7721663977', 'ООО "КОМПЬЮЦЕНТР"', 'Москва г']):
        self.dataset = pd.read_csv("dataset.csv")
        # Выбранный поставщик
        self.selected_supplier = selected_supplier
        self.selected_inn = int(self.selected_supplier[0])

        self.dataset['Участники КС - поставщики'] = self.dataset['Участники КС - поставщики'].apply(
            lambda x: ast.literal_eval(x) if pd.notna(x) else None
        )

        # Подготовка метрик и данных нужных для графиков

        # Получение всех уникальных КС выбранного поставщика
        self.all_sessions = self.dataset[self.dataset['Участники КС - поставщики'].apply(lambda suppliers_list: self.selected_supplier in suppliers_list)].drop_duplicates(subset=['Id КС'])
        # Количество участий
        self.number_all_sessions = len(self.all_sessions)
        # Получение выигрышных КС
        self.winner_sessions = self.dataset[self.dataset['ИНН победителя КС'] == self.selected_inn].drop_duplicates(subset=['Id КС'])
        # Количество побед
        self.number_winner_sessions = len(self.winner_sessions)
        # Доля выигранных КС
        self.share_winnings = self.number_winner_sessions / self.number_all_sessions


    def get_data_for_graphs(self, start_time = None, end_time = None):
        self.dataset['Окончание КС'] = pd.to_datetime(self.dataset['Окончание КС'])
        df_stats = self.dataset.copy()
        df_stats['Год-Месяц'] = df_stats['Окончание КС'].dt.to_period('M')

        # Считаем количество уникальных закупок по месяцам
        monthly_all = df_stats[df_stats['Id КС'].isin(self.all_sessions['Id КС'])].drop_duplicates(subset=['Id КС']).groupby('Год-Месяц').size()
        monthly_wins = df_stats[df_stats['Id КС'].isin(self.winner_sessions['Id КС'])].drop_duplicates(subset=['Id КС']).groupby('Год-Месяц').size()

        # Объединяем в один DataFrame
        result_df = pd.DataFrame({
            'Участия': monthly_all,
            'Победы': monthly_wins
        }).fillna(0).reset_index()

        # Преобразуем период в строку
        result_df['Год-Месяц'] = result_df['Год-Месяц'].astype(str)
        json_result_df = result_df.to_json(orient="records")
        return json_result_df



