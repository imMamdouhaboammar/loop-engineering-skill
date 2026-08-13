import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const rootDir = process.cwd();
const skillPath = join(rootDir, 'SKILL.md');

console.log('🔍 Validating Loop Engineering Skill...');

if (!existsSync(skillPath)) {
  console.error('❌ Error: SKILL.md missing!');
  process.exit(1);
}

const content = readFileSync(skillPath, 'utf8');

// Check YAML frontmatter
if (!content.startsWith('---')) {
  console.error('❌ Error: SKILL.md missing YAML frontmatter opening ---');
  process.exit(1);
}

const nameMatch = content.match(/^name:\s*([a-zA-Z0-9_-]+)/m);
const descMatch = content.match(/^description:\s*(.+)/m);

if (!nameMatch) {
  console.error('❌ Error: SKILL.md missing valid name in frontmatter!');
  process.exit(1);
}

if (!descMatch) {
  console.error('❌ Error: SKILL.md missing description in frontmatter!');
  process.exit(1);
}

const desc = descMatch[1].trim();
if (!desc.startsWith('Use when')) {
  console.warn('⚠️ Warning: description should start with "Use when..."');
}

console.log(`✅ Name: ${nameMatch[1]}`);
console.log(`✅ Description: ${desc}`);
console.log('✨ Skill validation passed successfully!');
