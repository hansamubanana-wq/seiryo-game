import Phaser from 'phaser';
import './style.css';

// --- 素材データ ---
const ASSETS = {
  grass: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjNGNhZjUwIi8+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjYiIGhlaWdodD0iNiIgZmlsbD0iIzNiOGUyZSIvPjxyZWN0IHg9IjEwIiB5PSIyMCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzNiOGUyZSIvPjxyZWN0IHg9IjQwIiB5PSI1MCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iIzNiOGUyZSIvPjxyZWN0IHg9IjUwIiB5PSIxMCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzNiOGUyZSIvPjwvc3ZnPg==',
  school: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3QgeD0iNCIgeT0iMjAiIHdpZHRoPSI1NiIgaGVpZ2h0PSI0MCIgZmlsbD0iIzhkNmU2MyIvPjxwYXRoIGQ9Ik0wIDIwIEwzMiAwIEw2NCAyMCBaIiBmaWxsPSIjNWQ0MDM3Ii8+PHJlY3QgeD0iMTIiIHk9IjMwIiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9IiNiYmRlZmIiLz48cmVjdCB4PSIzMCIgeT0iMzAiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2JiZGVmYiIvPjwvc3ZnPg==',
  teacher_base: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSI0OCI+PHJlY3QgeD0iOCIgeT0iMjAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIyMCIgZmlsbD0id2UiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjEyIiByPSI4IiBujZpbGw9IiNmZmNjYmMiLz48cmVjdCB4PSIxMCIgeT0iNDAiIHdpZHRoPSI0IiBoZWlnaHQ9IjgiIGZpbGw9IiMzMzMiLz48cmVjdCB4PSIxOCIgeT0iNDAiIHdpZHRoPSI0IiBoZWlnaHQ9IjgiIGZpbGw9IiMzMzMiLz48L3N2Zz4=', 
  student: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSI0OCI+PHJlY3QgeD0iOCIgeT0iMjAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIyMCIgZmlsbD0iIzMzMzMzMyIvPjxMKciY2lyY2xlIGN4PSIxNiIgY3k9IjEyIiByPSI4IiBujZpbGw9IiNmZmNjYmMiLz48cmVjdCB4PSIxMCIgeT0iNDAiIHdpZHRoPSI0IiBoZWlnaHQ9IjgiIGZpbGw9IiMzMzMzMzMiLz48cmVjdCB4PSIxOCIgeT0iNDAiIHdpZHRoPSI0IiBoZWlnaHQ9IjgiIGZpbGw9IiMzMzMzMzMiLz48L3N2Zz4='
};

// --- 先生データ ---
interface TeacherInfo {
  name: string;
  subject: string;
  color: number;
}
const TEACHER_LIST: TeacherInfo[] = [
  { name: '加藤先生', subject: '数学', color: 0x1e88e5 },
  { name: '福盛田先生', subject: '保健体育', color: 0xe53935 },
  { name: '松本先生', subject: '英語', color: 0xffb74d },
  { name: '松田先生', subject: '英語', color: 0xffb74d },
  { name: '大島先生', subject: '美術', color: 0xe91e63 },
  { name: 'Ms. García', subject: '英会話', color: 0xab47bc },
  { name: 'Ms. Nah', subject: '英会話', color: 0xab47bc },
  { name: '大谷先生', subject: '古典', color: 0x5d4037 },
  { name: '北井先生', subject: '現代国語', color: 0x8d6e63 },
  { name: '松村先生', subject: '理科一', color: 0x43a047 },
  { name: '須藤先生', subject: '社会', color: 0xfdd835 },
  { name: '飯野先生', subject: '技術', color: 0x607d8b },
  { name: '西塚先生', subject: '家庭科', color: 0xf06292 },
  { name: '西岡先生', subject: '理科二', color: 0x2e7d32 },
];

// --- 型定義 ---
interface TeacherSaveData { x: number; y: number; name: string; subject: string; color: number; }
interface SaveData {
  money: number; day: number; hour: number; minute: number;
  mapData: number[][]; teachers: TeacherSaveData[];
}

// --- ボタン作成関数（鉄壁のZone方式） ---
// 透明な「Zone」を一番手前に置くことで、文字があっても確実にクリックを拾う
function createButton(scene: Phaser.Scene, x: number, y: number, label: string, callback: () => void, color: number = 0x004d40, width: number = 160) {
  const container = scene.add.container(x, y);
  container.setScrollFactor(0);
  container.setDepth(10000);

  const height = 40;

  // 1. 背景（見た目だけ。判定は持たせない）
  const bg = scene.add.rectangle(0, 0, width, height, color);
  bg.setStrokeStyle(2, 0xffffff);
  
  // 2. テキスト（見た目だけ）
  const text = scene.add.text(0, 0, label, { fontSize: '16px', color: '#ffffff', fontFamily: 'sans-serif' }).setOrigin(0.5);

  // 3. 判定用ゾーン（透明な板。これを一番手前に置く！）
  const zone = scene.add.zone(0, 0, width, height)
    .setInteractive({ useHandCursor: true });

  // 順番重要：zoneを最後にaddすることで最前面に来る
  container.add([bg, text, zone]);

  // イベントは zone に対して設定
  zone.on('pointerdown', () => {
    scene.tweens.add({ targets: container, scale: { from: 0.95, to: 1 }, duration: 50, yoyo: true, onComplete: callback });
  });
  
  // ホバー演出
  zone.on('pointerover', () => bg.setFillStyle(color + 0x222222));
  zone.on('pointerout', () => bg.setFillStyle(color));
  
  return container;
}

// --- 生徒クラス ---
class Student extends Phaser.GameObjects.Sprite {
  private targetBuilding: Phaser.GameObjects.Image | null = null;
  private speed: number = 0.08;
  constructor(scene: Phaser.Scene, x: number, y: number, target: Phaser.GameObjects.Image | null) {
    super(scene, x, y, 'student');
    scene.add.existing(this);
    this.setOrigin(0.5, 1.0);
    this.targetBuilding = target;
    this.setScale(0.8);
  }
  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (this.targetBuilding && this.targetBuilding.active) {
        const tx = this.targetBuilding.x + 32;
        const ty = this.targetBuilding.y + 32;
        const distance = Phaser.Math.Distance.Between(this.x, this.y, tx, ty);
        if (distance < 5) { this.emit('arrive'); this.destroy(); }
        else {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, tx, ty);
            this.x += Math.cos(angle) * this.speed * delta;
            this.y += Math.sin(angle) * this.speed * delta;
            this.y += Math.sin(time / 50) * 0.8;
            this.setDepth(this.y);
        }
    } else { this.destroy(); }
  }
}

// --- 先生クラス ---
class Teacher extends Phaser.GameObjects.Sprite {
  private moveTimer: number = 0; private targetX: number = 0; private targetY: number = 0;
  private mapWidth: number; private mapHeight: number; private tileSize: number;
  public teacherName: string; public subject: string; public color: number;
  private nameText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, mapWidth: number, mapHeight: number, tileSize: number, info: TeacherInfo) {
    super(scene, x, y, 'teacher_base');
    this.scene = scene;
    this.mapWidth = mapWidth; this.mapHeight = mapHeight; this.tileSize = tileSize;
    this.teacherName = info.name; this.subject = info.subject; this.color = info.color;
    this.setTint(info.color);
    scene.add.existing(this);
    this.setOrigin(0.5, 1.0);
    this.targetX = x; this.targetY = y;
    this.nameText = scene.add.text(x, y - 50, `${info.subject}\n${info.name}`, {
      fontSize: '12px', color: '#ffffff', stroke: '#000', strokeThickness: 2, align: 'center'
    }).setOrigin(0.5).setDepth(10000);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.targetX, this.targetY);
    if (distance < 2) {
      this.moveTimer -= delta;
      if (this.moveTimer <= 0) this.decideNextMove();
    } else {
      const speed = 0.06 * delta;
      const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetX, this.targetY);
      this.x += Math.cos(angle) * speed;
      this.y += Math.sin(angle) * speed;
      this.y += Math.sin(time / 100) * 0.5;
    }
    this.setDepth(this.y);
    if (this.nameText) {
        this.nameText.setPosition(this.x, this.y - 50);
        this.nameText.setDepth(this.y + 100);
    }
  }
  destroy(fromScene?: boolean) { if (this.nameText) this.nameText.destroy(); super.destroy(fromScene); }
  decideNextMove() {
    const gridX = Phaser.Math.Between(0, this.mapWidth - 1);
    const gridY = Phaser.Math.Between(0, this.mapHeight - 1);
    this.targetX = gridX * this.tileSize + (this.tileSize / 2);
    this.targetY = gridY * this.tileSize + (this.tileSize / 2);
    this.moveTimer = Phaser.Math.Between(2000, 5000);
  }
}

// --- タイトル画面 ---
class TitleScene extends Phaser.Scene {
  constructor() { super('TitleScene'); }
  create() {
    this.cameras.main.setBackgroundColor('#1a1a1a');
    this.add.text(640, 250, '青稜学園\n経営シミュレーション', {
      fontSize: '64px', color: '#4caf50', fontFamily: 'serif', align: 'center', stroke: '#ffffff', strokeThickness: 4
    }).setOrigin(0.5);
    const hasSave = localStorage.getItem('seiryo_save') !== null;
    const btnText = hasSave ? '続きから再開' : 'ゲームスタート';
    createButton(this, 640, 450, btnText, () => this.scene.start('GameScene'), 0x2e7d32);
    if (hasSave) {
      createButton(this, 640, 520, 'データを消して最初から', () => {
        localStorage.removeItem('seiryo_save');
        this.scene.restart();
      }, 0xc62828);
    }
    this.add.text(640, 680, '© 2026 Seiryo Game Project', { fontSize: '16px', color: '#666' }).setOrigin(0.5);
  }
}

// --- ゲーム本編 ---
class GameScene extends Phaser.Scene {
  private money: number = 1000000;
  private mapWidth: number = 30; private mapHeight: number = 20; private tileSize: number = 64;
  private mapData: number[][] = [];
  private teachers!: Phaser.GameObjects.Group;
  private buildings!: Phaser.GameObjects.Group;
  private students!: Phaser.GameObjects.Group;
  private day: number = 1; private hour: number = 8; private minute: number = 0; private timeTimer: number = 0;
  private spawnTimer: number = 0;
  private moneyText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private infoText!: Phaser.GameObjects.Text;
  private isHiringWindowOpen: boolean = false;
  private hiringContainer!: Phaser.GameObjects.Container;

  constructor() { super('GameScene'); }
  preload() {
    this.load.image('grass', ASSETS.grass);
    this.load.image('school_building', ASSETS.school);
    const tBase = this.make.graphics({x:0, y:0});
    tBase.fillStyle(0xffffff); tBase.fillRect(10, 20, 12, 20); tBase.fillStyle(0xffccbc); tBase.fillCircle(16, 12, 10);
    tBase.generateTexture('teacher_base', 32, 48);
    const student = this.make.graphics({x:0, y:0});
    student.fillStyle(0x333333); student.fillRect(10, 20, 12, 20); student.fillStyle(0xffccbc); student.fillCircle(16, 12, 10);
    student.generateTexture('student', 32, 48);
  }
  create() {
    this.teachers = this.add.group({ runChildUpdate: true });
    this.buildings = this.add.group();
    this.students = this.add.group({ runChildUpdate: true });
    this.mapData = [];
    for (let y = 0; y < this.mapHeight; y++) {
      const row: number[] = [];
      for (let x = 0; x < this.mapWidth; x++) {
        row.push(0);
        const tile = this.add.image(x * this.tileSize, y * this.tileSize, 'grass');
        tile.setOrigin(0, 0); tile.setDepth(0);
      }
      this.mapData.push(row);
    }
    this.cameras.main.setBounds(0, 0, this.mapWidth * this.tileSize, this.mapHeight * this.tileSize);
    this.cameras.main.centerOn((this.mapWidth * this.tileSize) / 2, (this.mapHeight * this.tileSize) / 2);
    this.createUI();
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => this.handleInput(pointer));
    this.loadGame();
  }
  createUI() {
    const uiContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(9000);
    const timeBg = this.add.rectangle(1100, 30, 300, 40, 0x000000, 0.7);
    uiContainer.add(timeBg);
    this.timeText = this.add.text(1000, 15, '', { fontSize: '24px', color: '#ffffff', fontFamily: 'monospace' });
    uiContainer.add(this.timeText);
    this.moneyText = this.add.text(20, 20, '', { fontSize: '24px', color: '#ffffff', backgroundColor: '#000000', padding: { x: 10, y: 5 } });
    uiContainer.add(this.moneyText);
    this.updateMoneyText();
    this.infoText = this.add.text(640, 650, '経営開始！', { fontSize: '20px', color: '#ffff00', backgroundColor: '#000000', padding: { x: 20, y: 10 } }).setOrigin(0.5);
    uiContainer.add(this.infoText);

    createButton(this, 100, 80, '求人一覧を見る', () => this.toggleHiringWindow(), 0x004d40);
    createButton(this, 280, 80, 'セーブする', () => this.saveGame(), 0x0277bd);
  }

  // --- 求人ウィンドウ（ここもZone方式に修正） ---
  toggleHiringWindow() {
    if (this.isHiringWindowOpen) {
        this.hiringContainer.destroy();
        this.isHiringWindowOpen = false;
        return;
    }
    this.isHiringWindowOpen = true;
    this.hiringContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(11000);

    // 背景にZoneを置いて、裏側のクリックをブロックする
    const blocker = this.add.zone(640, 360, 1000, 600).setInteractive();
    const bg = this.add.rectangle(640, 360, 1000, 600, 0x000000, 0.9);
    this.hiringContainer.add([bg, blocker]); // blockerが手前だとクリック吸う
    
    const title = this.add.text(640, 100, '雇用する先生を選んでください (雇用費: 50万円)', { fontSize: '28px', color: '#ffffff', stroke: '#004d40', strokeThickness: 4 }).setOrigin(0.5);
    this.hiringContainer.add(title);
    
    // 閉じるボタン
    const closeBtn = createButton(this, 640, 600, '閉じる', () => this.toggleHiringWindow(), 0x555555);
    this.hiringContainer.add(closeBtn);

    let x = 340; let y = 160;
    TEACHER_LIST.forEach((info, index) => {
        const isHired = this.teachers.getChildren().some((t: any) => t.teacherName === info.name);
        const btnLabel = isHired ? `${info.name} (雇用済)` : `${info.subject} ${info.name}`;
        const btnColor = isHired ? 0x333333 : info.color;
        
        const btnContainer = this.add.container(x, y);
        const btnBg = this.add.rectangle(0, 0, 280, 40, btnColor);
        btnBg.setStrokeStyle(2, 0xffffff);
        const btnText = this.add.text(0, 0, btnLabel, { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);
        
        // ここもZoneを使う！
        const btnZone = this.add.zone(0, 0, 280, 40);
        
        if (!isHired) {
            btnZone.setInteractive({ useHandCursor: true });
            btnZone.on('pointerdown', () => {
                this.hireSpecificTeacher(info);
                this.toggleHiringWindow(); this.toggleHiringWindow();
            });
            btnZone.on('pointerover', () => btnBg.setAlpha(0.8));
            btnZone.on('pointerout', () => btnBg.setAlpha(1));
        }

        btnContainer.add([btnBg, btnText, btnZone]);
        this.hiringContainer.add(btnContainer);

        y += 60;
        if (index === 6) { x = 940; y = 160; }
    });
  }

  saveGame() {
    const teacherData: TeacherSaveData[] = [];
    this.teachers.getChildren().forEach((go) => {
      const t = go as Teacher;
      teacherData.push({ x: t.x, y: t.y, name: t.teacherName, subject: t.subject, color: t.color });
    });
    const saveData: SaveData = {
      money: this.money, day: this.day, hour: this.hour, minute: this.minute,
      mapData: this.mapData, teachers: teacherData
    };
    localStorage.setItem('seiryo_save', JSON.stringify(saveData));
    this.showInfo('データを保存しました', '#00ff00');
  }
  loadGame() {
    const rawData = localStorage.getItem('seiryo_save');
    if (!rawData) return;
    const data: SaveData = JSON.parse(rawData);
    this.money = data.money; this.day = data.day; this.hour = data.hour; this.minute = data.minute;
    this.updateMoneyText(); this.updateTimeText();
    this.buildings.clear(true, true);
    this.mapData = data.mapData;
    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        if (this.mapData[y][x] === 1) {
          const building = this.add.image(x * this.tileSize, y * this.tileSize, 'school_building');
          building.setOrigin(0, 0); building.setDepth((y + 1) * this.tileSize);
          this.buildings.add(building);
        }
      }
    }
    this.teachers.clear(true, true);
    data.teachers.forEach(tData => {
      const info: TeacherInfo = { name: tData.name || '派遣教員', subject: tData.subject || 'その他', color: tData.color || 0x1e88e5 };
      const teacher = new Teacher(this, tData.x, tData.y, this.mapWidth, this.mapHeight, this.tileSize, info);
      this.teachers.add(teacher);
    });
    this.showInfo('続きから再開しました', '#ffffff');
  }
  update(time: number, delta: number) {
    if (this.input.activePointer.isDown) {
      if (this.input.activePointer.prevPosition.x !== 0) {
        const scrollX = this.input.activePointer.position.x - this.input.activePointer.prevPosition.x;
        const scrollY = this.input.activePointer.position.y - this.input.activePointer.prevPosition.y;
        this.cameras.main.scrollX -= scrollX; this.cameras.main.scrollY -= scrollY;
      }
    }
    this.timeTimer += delta;
    if (this.timeTimer > 50) {
      this.timeTimer = 0; this.minute += 10;
      if (this.minute >= 60) { this.minute = 0; this.hour++; if (this.hour >= 24) { this.hour = 0; this.day++; this.dailySettlement(); } }
      this.updateTimeText();
    }
    if (this.hour >= 7 && this.hour <= 9) {
        this.spawnTimer += delta;
        if (this.spawnTimer > 1000) { this.spawnStudent(); this.spawnTimer = 0; }
    }
  }
  spawnStudent() {
    const buildings = this.buildings.getChildren();
    if (buildings.length === 0) return;
    const target = buildings[Phaser.Math.Between(0, buildings.length - 1)] as Phaser.GameObjects.Image;
    let startX = 0; let startY = 0;
    if (Math.random() > 0.5) { startX = Phaser.Math.Between(0, this.mapWidth * this.tileSize); startY = this.mapHeight * this.tileSize; }
    else { startX = 0; startY = Phaser.Math.Between(0, this.mapHeight * this.tileSize); }
    const student = new Student(this, startX, startY, target);
    this.students.add(student);
    student.on('arrive', () => { this.earnTuition(student.x, student.y); });
  }
  earnTuition(x: number, y: number) {
    const amount = 1000; this.money += amount; this.updateMoneyText();
    const popText = this.add.text(x, y - 40, `+${amount}`, { fontSize: '20px', color: '#ffd700', stroke: '#000', strokeThickness: 3 }).setOrigin(0.5);
    this.tweens.add({ targets: popText, y: y - 80, alpha: 0, duration: 1000, onComplete: () => popText.destroy() });
  }
  dailySettlement() {
    const expense = this.teachers.getLength() * 10000;
    this.money -= expense; this.updateMoneyText();
    this.showInfo(`【決算】給料支払い:-${expense.toLocaleString()}円`, '#ff0000');
  }
  updateTimeText() { const hh = this.hour.toString().padStart(2, '0'); const mm = this.minute.toString().padStart(2, '0'); this.timeText.setText(`${this.day}日目 ${hh}:${mm}`); }
  updateMoneyText() { this.moneyText.setText(`資金: ${this.money.toLocaleString()}円`); }
  hireSpecificTeacher(info: TeacherInfo) {
    const cost = 500000;
    if (this.money < cost) { this.showInfo('資金が足りません！', '#ff0000'); return; }
    this.money -= cost;
    this.updateMoneyText();
    const centerX = (this.mapWidth * this.tileSize) / 2;
    const centerY = (this.mapHeight * this.tileSize) / 2;
    const newTeacher = new Teacher(this, centerX, centerY, this.mapWidth, this.mapHeight, this.tileSize, info);
    this.teachers.add(newTeacher);
    this.showInfo(`${info.name}を雇用しました`, '#00ff00');
  }
  placeBuilding(pointer: Phaser.Input.Pointer) {
    if (this.isHiringWindowOpen) return;
    const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
    const mapX = Math.floor(worldPoint.x / this.tileSize);
    const mapY = Math.floor(worldPoint.y / this.tileSize);
    if (mapX < 0 || mapX >= this.mapWidth || mapY < 0 || mapY >= this.mapHeight) return;
    if (this.mapData[mapY][mapX] === 1) return;
    const cost = 100000;
    if (this.money < cost) { this.showInfo('資金不足です', '#ff0000'); return; }
    this.money -= cost;
    this.updateMoneyText();
    this.mapData[mapY][mapX] = 1;
    const building = this.add.image(mapX * this.tileSize, mapY * this.tileSize, 'school_building');
    building.setOrigin(0, 0); building.setDepth((mapY + 1) * this.tileSize);
    this.buildings.add(building);
    this.tweens.add({ targets: building, scaleY: { from: 0, to: 1 }, duration: 300, ease: 'Back.out' });
  }
  handleInput(pointer: Phaser.Input.Pointer) {
    if (this.isHiringWindowOpen) return;
    if (pointer.position.y < 150) return;
    if (pointer.getDistance() < 10) this.placeBuilding(pointer);
  }
  showInfo(text: string, color: string) {
    this.infoText.setText(text); this.infoText.setColor(color);
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, width: 1280, height: 720, parent: 'app',
  backgroundColor: '#2d2d2d',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  pixelArt: true,
  scene: [TitleScene, GameScene]
};
new Phaser.Game(config);