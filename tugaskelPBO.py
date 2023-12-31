import sys
import datetime
from PyQt5.QtCore import Qt, QTimer
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QLabel, QPushButton, QLCDNumber


class ACControllerApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("AC Controller")
        self.setFixedSize(400, 250)

        # Kontrol
        self.power_label = QLabel("Power: ON", self)
        self.power_label.move(50, 50)
        self.power_button = QPushButton("Turn Off", self)
        self.power_button.move(50, 80)
        self.power_button.clicked.connect(self.toggle_power)

        self.temperature_lcd = QLCDNumber(self)
        self.temperature_lcd.setDigitCount(2)  # Menampilkan 2 digit angka
        self.temperature_lcd.setSegmentStyle(QLCDNumber.Flat)  # Tampilan tebal
        self.temperature_lcd.display(25)

        self.decreaseButton = QPushButton("Decrease")
        self.increaseButton = QPushButton("Increase")

        self.mode_label = QLabel("Mode: Cooling", self)
        self.mode_label.move(50, 200)
        self.mode_button = QPushButton("Change Mode", self)
        self.mode_button.clicked.connect(self.change_mode)

        self.clock_label = QLabel("", self)
        self.clock_label.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        self.clock_label.move(290, 5)

        # Membuat layout
        layout = QVBoxLayout()
        layout.addWidget(self.power_label)
        layout.addWidget(self.power_button)
        layout.addWidget(self.temperature_lcd)
        layout.addWidget(self.decreaseButton)
        layout.addWidget(self.increaseButton)
        layout.addWidget(self.mode_label)
        layout.addWidget(self.mode_button)

        # Membuat widget utama dan menetapkan layout
        main_widget = QWidget()
        main_widget.setLayout(layout)

        # Menetapkan widget utama ke jendela utama
        self.setCentralWidget(main_widget)

        # Menghubungkan tombol dengan fungsi
        self.decreaseButton.clicked.connect(self.decrease_temperature)
        self.increaseButton.clicked.connect(self.increase_temperature)

        self.mode = "Cooling"

        # Mengatur timer untuk memperbarui jam setiap detik
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_clock)
        self.timer.start(1000)  # Interval 1000 ms = 1 detik

        # Memanggil fungsi update_clock() secara langsung agar jam ditampilkan saat pertama kali aplikasi dijalankan
        self.update_clock()

    def toggle_power(self):
        if self.power_button.text() == "Turn Off":
            self.power_button.setText("Turn On")
            self.power_label.setText("Power: Off")
            self.temperature_lcd.setEnabled(False)
            self.decreaseButton.setEnabled(False)
            self.increaseButton.setEnabled(False)
            self.mode_button.setEnabled(False)
        else:
            self.power_button.setText("Turn Off")
            self.power_label.setText("Power: ON")
            self.temperature_lcd.setEnabled(True)
            self.decreaseButton.setEnabled(True)
            self.increaseButton.setEnabled(True)
            self.mode_button.setEnabled(True)

    def decrease_temperature(self):
        current_value = int(self.temperature_lcd.value())
        if current_value > 14:
            self.temperature_lcd.display(current_value - 1)

    def increase_temperature(self):
        current_value = int(self.temperature_lcd.value())
        if current_value < 25:
            self.temperature_lcd.display(current_value + 1)

    def change_mode(self):
        if self.mode == "Cooling":
            self.mode = "Heating"
        elif self.mode == "Heating":
            self.mode = "Fan"
        else:
            self.mode = "Cooling"
        self.mode_label.setText(f"Mode: {self.mode}")

    def update_clock(self):
        current_time = datetime.datetime.now().strftime("%H:%M:%S")
        self.clock_label.setText(current_time)


if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = ACControllerApp()
    window.show()
    sys.exit(app.exec_())
