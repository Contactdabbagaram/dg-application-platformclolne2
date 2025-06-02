
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSupportSettings, useUpdateSupportSettings } from '@/hooks/useSupportSettings';
import { Bot, Clock, MessageSquare, Volume2, Globe } from 'lucide-react';

interface SupportBotSettingsProps {
  restaurantId: string;
}

const SupportBotSettings = ({ restaurantId }: SupportBotSettingsProps) => {
  const { data: settings, isLoading } = useSupportSettings(restaurantId);
  const updateSettings = useUpdateSupportSettings();
  
  const [formData, setFormData] = useState({
    bot_name: 'DabbaBot',
    bot_avatar_url: '',
    bot_personality: 'friendly',
    working_hours_start: '09:00',
    working_hours_end: '22:00',
    offline_message: 'We are currently offline. Please leave a message and we will get back to you soon.',
    auto_escalate_after_minutes: 10,
    response_delay_seconds: 2,
    enable_typing_indicator: true,
    enable_sound: true,
    default_language: 'en',
    is_active: true,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        bot_name: settings.bot_name || 'DabbaBot',
        bot_avatar_url: settings.bot_avatar_url || '',
        bot_personality: settings.bot_personality || 'friendly',
        working_hours_start: settings.working_hours_start || '09:00',
        working_hours_end: settings.working_hours_end || '22:00',
        offline_message: settings.offline_message || 'We are currently offline. Please leave a message and we will get back to you soon.',
        auto_escalate_after_minutes: settings.auto_escalate_after_minutes || 10,
        response_delay_seconds: settings.response_delay_seconds || 2,
        enable_typing_indicator: settings.enable_typing_indicator ?? true,
        enable_sound: settings.enable_sound ?? true,
        default_language: settings.default_language || 'en',
        is_active: settings.is_active ?? true,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        restaurantId,
        updates: formData,
      });
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  if (isLoading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Bot Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Bot Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bot_name">Bot Name</Label>
                <Input
                  id="bot_name"
                  value={formData.bot_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, bot_name: e.target.value }))}
                  placeholder="DabbaBot"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bot_avatar_url">Avatar URL (optional)</Label>
                <Input
                  id="bot_avatar_url"
                  value={formData.bot_avatar_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, bot_avatar_url: e.target.value }))}
                  placeholder="https://example.com/avatar.png"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Bot Personality</Label>
              <Select value={formData.bot_personality} onValueChange={(value) => setFormData(prev => ({ ...prev, bot_personality: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Friendly & Casual</SelectItem>
                  <SelectItem value="professional">Professional & Formal</SelectItem>
                  <SelectItem value="helpful">Helpful & Supportive</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic & Energetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Working Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="working_hours_start">Start Time</Label>
                <Input
                  id="working_hours_start"
                  type="time"
                  value={formData.working_hours_start}
                  onChange={(e) => setFormData(prev => ({ ...prev, working_hours_start: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="working_hours_end">End Time</Label>
                <Input
                  id="working_hours_end"
                  type="time"
                  value={formData.working_hours_end}
                  onChange={(e) => setFormData(prev => ({ ...prev, working_hours_end: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="offline_message">Offline Message</Label>
              <Textarea
                id="offline_message"
                value={formData.offline_message}
                onChange={(e) => setFormData(prev => ({ ...prev, offline_message: e.target.value }))}
                placeholder="Message shown when support is offline"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Response Behavior */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Response Behavior
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="response_delay">Response Delay (seconds)</Label>
                <Input
                  id="response_delay"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.response_delay_seconds}
                  onChange={(e) => setFormData(prev => ({ ...prev, response_delay_seconds: parseInt(e.target.value) || 0 }))}
                />
                <p className="text-xs text-gray-500">
                  Delay before bot responds to simulate human typing
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="escalate_time">Auto-escalate after (minutes)</Label>
                <Input
                  id="escalate_time"
                  type="number"
                  min="1"
                  max="60"
                  value={formData.auto_escalate_after_minutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, auto_escalate_after_minutes: parseInt(e.target.value) || 10 }))}
                />
                <p className="text-xs text-gray-500">
                  Time before offering human agent assistance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interface Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Interface Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="typing_indicator">Show Typing Indicator</Label>
                  <p className="text-sm text-gray-600">Show animated dots when bot is typing</p>
                </div>
                <Switch
                  id="typing_indicator"
                  checked={formData.enable_typing_indicator}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_typing_indicator: checked }))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound_notifications">Sound Notifications</Label>
                  <p className="text-sm text-gray-600">Play sound for new messages</p>
                </div>
                <Switch
                  id="sound_notifications"
                  checked={formData.enable_sound}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_sound: checked }))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="bot_active">Bot Active</Label>
                  <p className="text-sm text-gray-600">Enable AI bot responses</p>
                </div>
                <Switch
                  id="bot_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Default Language
              </Label>
              <Select value={formData.default_language} onValueChange={(value) => setFormData(prev => ({ ...prev, default_language: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="mr">Marathi</SelectItem>
                  <SelectItem value="gu">Gujarati</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateSettings.isPending}>
          {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default SupportBotSettings;
