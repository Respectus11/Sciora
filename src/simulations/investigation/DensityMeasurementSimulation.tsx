import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { SimulationWorkspace } from '@/components/simulation/SimulationWorkspace';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, radii } from '@/design-system';

interface MaterialSample { id: string; name: string; density: number; color: string; volume: number; }
const MATERIALS: MaterialSample[] = [
  { id: 'wood', name: 'Acacia Wood', density: 0.65, color: '#D97706', volume: 40 },
  { id: 'plastic', name: 'Wax Plastic', density: 0.92, color: '#10B981', volume: 30 },
  { id: 'aluminum', name: 'Aluminum', density: 2.70, color: '#94A3B8', volume: 25 },
  { id: 'iron', name: 'Iron Nugget', density: 7.87, color: '#64748B', volume: 20 },
  { id: 'gold', name: 'Shakiso Gold', density: 19.3, color: '#F59E0B', volume: 15 },
];
export const DensityMeasurementSimulation: React.FC = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialSample>(MATERIALS[0]);
  const [isSubmerged, setIsSubmerged] = useState(false);
  const initialVolume = 100;
  const mass = Math.round(selectedMaterial.density * selectedMaterial.volume * 10) / 10;
  const isFloating = selectedMaterial.density < 1.0;
  const displacedVolume = isFloating ? mass : selectedMaterial.volume;
  const currentVolume = isSubmerged ? initialVolume + displacedVolume : initialVolume;
  const calculatedDensity = (mass / selectedMaterial.volume).toFixed(2);
  const svgWidth = 340; const svgHeight = 260;
  const cylX = 170; const cylY = 40; const cylW = 70; const cylH = 180;
  const waterHeight = Math.min(150, (currentVolume / 150) * 120);
  const waterY = cylY + cylH - waterHeight;
  const sampleSize = Math.max(20, Math.min(36, selectedMaterial.volume));
  const sampleX = isSubmerged ? cylX + (cylW - sampleSize) / 2 : 55;
  const sampleY = isSubmerged ? (isFloating ? waterY - sampleSize * 0.35 : cylY + cylH - sampleSize - 4) : 150;
  return (
    <SimulationWorkspace title='Water Displacement & Density Lab' unitTag='Grade 8 Science • Unit 1.2' onReset={() => { setSelectedMaterial(MATERIALS[0]); setIsSubmerged(false); }} telemetry={[{ label: 'Mass (m)', value: isSubmerged ? '0.0' : String(mass), unit: 'g', color: colors.cyan }, { label: 'Volume (V)', value: String(selectedMaterial.volume), unit: 'cm³', color: colors.amber }, { label: 'Displaced', value: isSubmerged ? '+' + String(Math.round(displacedVolume)) : '0', unit: 'mL', color: colors.emerald }, { label: 'Density (ρ)', value: String(calculatedDensity), unit: 'g/cm³', color: colors.violet }]} instructions={['Select a sample material from the chips below.', 'Observe its initial mass on the digital balance (left).', 'Submerge the sample into the 100 mL graduated cylinder (right).', 'Note the displaced volume and verify whether density exceeds 1.0 g/cm³ (water).']} controlsNode={<GlassCard variant='base' padding='md' style={styles.controlsCard}><Text style={styles.controlLabel}>Select Test Material Sample:</Text><View style={styles.materialChipsRow}>{MATERIALS.map(mat => (<Pressable key={mat.id} onPress={() => { setSelectedMaterial(mat); setIsSubmerged(false); }} style={[styles.chip, selectedMaterial.id === mat.id && styles.chipActive, { borderColor: mat.color }]}><View style={[styles.chipIndicator, { backgroundColor: mat.color }]} /><Text style={[styles.chipText, selectedMaterial.id === mat.id && styles.chipTextActive]}>{mat.name}</Text></Pressable>))}</View><Pressable style={[styles.actionButton, isSubmerged ? styles.actionExtract : styles.actionSubmerge]} onPress={() => setIsSubmerged(!isSubmerged)} accessibilityRole='button'><Text style={styles.actionButtonText}>{isSubmerged ? '▲ Lift Sample from Water' : '▼ Submerge in Water Cylinder'}</Text></Pressable></GlassCard>}>{() => (<View style={styles.canvasContainer}><Svg width={svgWidth} height={svgHeight} viewBox={'0 0 ' + svgWidth + ' ' + svgHeight}><Defs><LinearGradient id='waterGrad' x1='0' y1='0' x2='0' y2='1'><Stop offset='0%' stopColor='#00E5FF' stopOpacity='0.6' /><Stop offset='100%' stopColor='#0284C7' stopOpacity='0.85' /></LinearGradient><LinearGradient id='glassGrad' x1='0' y1='0' x2='1' y2='0'><Stop offset='0%' stopColor='#ffffff' stopOpacity='0.2' /><Stop offset='50%' stopColor='#ffffff' stopOpacity='0.05' /><Stop offset='100%' stopColor='#ffffff' stopOpacity='0.25' /></LinearGradient></Defs><G><Rect x='30' y='180' width='90' height='35' rx='6' fill='#1E293B' stroke='#334155' strokeWidth='1.5' /><Rect x='42' y='190' width='66' height='16' rx='3' fill='#0F172A' /><SvgText x='75' y='202' fontSize='11' fill='#00E5FF' fontWeight='bold' textAnchor='middle'>{!isSubmerged ? String(mass) + ' g' : '0.0 g'}</SvgText><SvgText x='75' y='230' fontSize='10' fill='#94A3B8' textAnchor='middle'>Digital Balance</SvgText></G><G><Rect x={cylX} y={cylY} width={cylW} height={cylH} rx='4' fill='url(#glassGrad)' stroke='rgba(255,255,255,0.4)' strokeWidth='2' /><Rect x={cylX - 15} y={cylY + cylH} width={cylW + 30} height='10' rx='3' fill='#334155' /><Rect x={cylX + 2} y={waterY} width={cylW - 4} height={waterHeight} rx='2' fill='url(#waterGrad)' />{[50, 75, 100, 125, 150].map(v => { const markY = cylY + cylH - (v / 150) * 120; return (<G key={v}><Line x1={cylX + 2} y1={markY} x2={cylX + 16} y2={markY} stroke='#ffffff' strokeWidth='1' strokeOpacity='0.7' /><SvgText x={cylX + 20} y={markY + 3.5} fontSize='8' fill='#E2E8F0'>{v + ' mL'}</SvgText></G>); })}<SvgText x={cylX + cylW / 2} y={cylY + cylH + 25} fontSize='10' fill='#94A3B8' textAnchor='middle'>Graduated Cylinder</SvgText></G><G><Rect x={sampleX} y={sampleY} width={sampleSize} height={sampleSize} rx='4' fill={selectedMaterial.color} stroke='#ffffff' strokeWidth='1.5' /><SvgText x={sampleX + sampleSize / 2} y={sampleY + sampleSize / 2 + 3} fontSize='9' fill='#ffffff' fontWeight='bold' textAnchor='middle'>{selectedMaterial.id.slice(0, 2).toUpperCase()}</SvgText></G>{isSubmerged && (<G><Line x1={cylX + cylW} y1={waterY} x2={cylX + cylW + 25} y2={waterY} stroke='#F59E0B' strokeWidth='1.5' strokeDasharray='3,2' /><SvgText x={cylX + cylW + 28} y={waterY + 3} fontSize='9' fill='#F59E0B' fontWeight='bold'>{String(Math.round(currentVolume)) + ' mL'}</SvgText></G>)}</Svg></View>)}</SimulationWorkspace>
  );
};
const styles = StyleSheet.create({
  canvasContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md },
  controlsCard: { marginTop: spacing.sm },
  controlLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.xs },
  materialChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm },
  chip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: radii.sm, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'transparent' },
  chipActive: { backgroundColor: 'rgba(0,229,255,0.12)', borderColor: colors.cyan },
  chipIndicator: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  chipText: { fontSize: 11, color: colors.textSecondary },
  chipTextActive: { color: colors.textPrimary, fontWeight: 'bold' },
  actionButton: { paddingVertical: 12, borderRadius: radii.md, alignItems: 'center', marginVertical: spacing.xs },
  actionSubmerge: { backgroundColor: colors.cyan },
  actionExtract: { backgroundColor: '#334155' },
  actionButtonText: { fontSize: 13, fontWeight: 'bold', color: '#0F172A' },
});